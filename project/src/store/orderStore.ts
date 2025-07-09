import { create } from 'zustand';
import { Order, OrderItem, CheckoutData } from '../types';
import { supabase } from '../lib/supabase';
import { emailService } from '../services/emailService';
import { paymentService } from '../services/paymentService';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  createOrder: (orderData: any) => Promise<Order>;
  fetchUserOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  processPayment: (orderData: any) => Promise<{ success: boolean; order?: Order; error?: string }>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  createOrder: async (orderData) => {
    set({ loading: true });
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          payment_method: orderData.payment_method,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount,
          shipping_amount: orderData.shipping_amount,
          total_amount: orderData.total_amount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address,
          notes: orderData.notes,
          status: 'pending',
          payment_status: orderData.payment_method === 'cod' ? 'pending' : 'pending'
        })
        .select(`
          *,
          profiles (*)
        `)
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        flavor: item.flavor,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) throw itemsError;

      // Add order items to the order object
      order.order_items = items;

      // Add initial tracking entry
      await supabase
        .from('order_tracking')
        .insert({
          order_id: order.id,
          status: 'Order Placed',
          message: orderData.payment_method === 'cod' 
            ? 'Your COD order has been received. We will call you within 24 hours to confirm.'
            : 'Your order has been received and is being processed.'
        });

      // Send order confirmation email to customer
      await emailService.sendOrderConfirmation(order);
      
      // Send admin notification email
      await emailService.sendAdminOrderNotification(order);

      // Update local state
      set(state => ({
        orders: [order, ...state.orders],
        loading: false
      }));

      return order;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  processPayment: async (orderData) => {
    try {
      set({ loading: true });

      // First create the order
      const order = await get().createOrder(orderData);

      // For COD orders, no payment processing needed
      if (orderData.payment_method === 'cod') {
        // Update order status to confirmed for COD
        await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            payment_status: 'pending' // COD payment is pending until delivery
          })
          .eq('id', order.id);

        // Add tracking entry for COD confirmation
        await supabase
          .from('order_tracking')
          .insert({
            order_id: order.id,
            status: 'Order Confirmed',
            message: 'Your COD order has been confirmed. Our team will call you within 24 hours.'
          });

        set({ loading: false });
        return { success: true, order };
      }

      // Process payment for non-COD orders
      const paymentResult = await paymentService.processPayment({
        amount: order.total_amount,
        currency: 'INR',
        paymentMethod: orderData.payment_method,
        orderId: order.id,
        customerDetails: {
          name: orderData.shipping_address.full_name,
          email: order.profiles?.email || '',
          phone: orderData.shipping_address.phone || ''
        }
      });

      if (paymentResult.success) {
        // Update order with payment details
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_intent_id: paymentResult.paymentId,
            status: 'confirmed'
          })
          .eq('id', order.id);

        // Add tracking entry
        await supabase
          .from('order_tracking')
          .insert({
            order_id: order.id,
            status: 'Payment Confirmed',
            message: 'Payment has been successfully processed.'
          });

        // Send status update notification
        await emailService.sendOrderStatusUpdate(order, 'confirmed');
      } else {
        // Update order status to failed
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled'
          })
          .eq('id', order.id);

        return {
          success: false,
          error: paymentResult.error || 'Payment processing failed'
        };
      }

      set({ loading: false });
      return { success: true, order };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Order processing failed'
      };
    }
  },

  fetchUserOrders: async (userId) => {
    set({ loading: true });
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_tracking (*),
          profiles (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ orders: orders || [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchOrderById: async (orderId) => {
    set({ loading: true });
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_tracking (*),
          profiles (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      set({ currentOrder: order, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // Add tracking entry
      await supabase
        .from('order_tracking')
        .insert({
          order_id: orderId,
          status: status.charAt(0).toUpperCase() + status.slice(1),
          message: `Order status updated to ${status}.`
        });

      // Get order details for notification
      const order = get().orders.find(o => o.id === orderId);
      if (order) {
        await emailService.sendOrderStatusUpdate(order, status);
      }

      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      }));
    } catch (error) {
      throw error;
    }
  }
}));