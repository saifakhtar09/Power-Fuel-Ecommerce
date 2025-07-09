import { supabase } from '../lib/supabase';
import { Order } from '../types';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private adminEmail = 'saifwork112@gmail.com'; // Your email address for order notifications

  private async getAdminSettings(key: string) {
    const { data } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', key)
      .single();
    
    return data?.value || {};
  }

  private generateOrderConfirmationEmail(order: Order): EmailTemplate {
    const itemsHtml = order.order_items?.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.product_image}" alt="${item.product_name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product_name}</strong><br>
          <small>${item.flavor} • ${item.size}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${item.total_price.toFixed(2)}
        </td>
      </tr>
    `).join('') || '';

    const isCOD = order.payment_method === 'cod';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - PowerFuel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0066ff, #ff6b35); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .cod-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order with PowerFuel</p>
          </div>
          
          <div class="content">
            <h2>Hi ${order.shipping_address.full_name},</h2>
            <p>Your order has been successfully placed and is being processed. Here are your order details:</p>
            
            ${isCOD ? `
            <div class="cod-notice">
              <h3 style="color: #856404; margin-top: 0;">📞 Cash on Delivery Order</h3>
              <p style="color: #856404; margin-bottom: 0;">
                Our team will call you within 24 hours to confirm your order details. 
                Please keep ₹${order.total_amount.toFixed(2)} ready (including ₹50 COD charges).
              </p>
            </div>
            ` : ''}
            
            <div class="order-details">
              <h3>Order #${order.order_number}</h3>
              <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Payment Status:</strong> ${order.payment_status.toUpperCase()}</p>
              
              <h4>Items Ordered:</h4>
              <table class="table">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: left;">Details</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; text-align: right;">
                <p><strong>Subtotal: ₹${order.subtotal.toFixed(2)}</strong></p>
                <p><strong>Tax (GST): ₹${order.tax_amount.toFixed(2)}</strong></p>
                <p><strong>Shipping: ₹${order.shipping_amount.toFixed(2)}</strong></p>
                ${isCOD ? `<p><strong>COD Charges: ₹50.00</strong></p>` : ''}
                <h3 style="color: #0066ff;">Total: ₹${order.total_amount.toFixed(2)}</h3>
              </div>
            </div>
            
            <div class="order-details">
              <h4>Shipping Address:</h4>
              <p>
                ${order.shipping_address.full_name}<br>
                ${order.shipping_address.phone}<br>
                ${order.shipping_address.address_line_1}<br>
                ${order.shipping_address.address_line_2 ? order.shipping_address.address_line_2 + '<br>' : ''}
                ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
                ${order.shipping_address.country}
              </p>
            </div>
            
            ${isCOD ? `
            <div class="cod-notice">
              <h4 style="color: #856404;">COD Delivery Instructions:</h4>
              <ul style="color: #856404;">
                <li>Keep exact change ready: ₹${order.total_amount.toFixed(2)}</li>
                <li>Our delivery partner will call before delivery</li>
                <li>Delivery within 3-7 business days</li>
                <li>Payment accepted in cash only</li>
              </ul>
            </div>
            ` : `
            <p>We'll send you another email when your order ships. You can track your order status anytime by logging into your account.</p>
            `}
            
            <a href="${window.location.origin}/orders/${order.id}" class="button">Track Your Order</a>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing PowerFuel!</p>
            <p>Questions? Contact us at support@powerfuel.com or call +91-9876543210</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Order Confirmation - PowerFuel
      
      Hi ${order.shipping_address.full_name},
      
      Your order #${order.order_number} has been confirmed!
      
      Order Details:
      - Order Date: ${new Date(order.created_at).toLocaleDateString()}
      - Payment Method: ${order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method.replace('_', ' ').toUpperCase()}
      - Total Amount: ₹${order.total_amount.toFixed(2)}
      
      ${isCOD ? `
      COD Instructions:
      - Our team will call you within 24 hours to confirm
      - Keep ₹${order.total_amount.toFixed(2)} ready (including ₹50 COD charges)
      - Delivery within 3-7 business days
      ` : 'We\'ll notify you when your order ships.'}
      
      Thank you for choosing PowerFuel!
    `;

    return {
      subject: `Order Confirmation #${order.order_number} - PowerFuel`,
      html,
      text
    };
  }

  private generateAdminOrderNotification(order: Order): EmailTemplate {
    const isCOD = order.payment_method === 'cod';
    const itemsHtml = order.order_items?.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.flavor} • ${item.size}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.total_price.toFixed(2)}</td>
      </tr>
    `).join('') || '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>🚨 NEW ORDER ALERT - PowerFuel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 20px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545; }
          .table { width: 100%; border-collapse: collapse; }
          .cod-alert { background: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .customer-info { background: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .urgent { background: #f8d7da; border: 2px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 NEW ORDER RECEIVED</h1>
            <h2>Order #${order.order_number}</h2>
            <p style="font-size: 18px; margin: 0;">Total: ₹${order.total_amount.toFixed(2)}</p>
          </div>
          
          <div class="content">
            ${isCOD ? `
            <div class="urgent">
              <h2 style="color: #721c24; margin-top: 0;">🔥 URGENT: COD ORDER - IMMEDIATE ACTION REQUIRED</h2>
              <p style="color: #721c24; font-size: 16px; font-weight: bold; margin-bottom: 0;">
                ⏰ CALL CUSTOMER WITHIN 24 HOURS TO CONFIRM ORDER
              </p>
            </div>
            ` : ''}
            
            <div class="customer-info">
              <h2 style="margin-top: 0;">👤 CUSTOMER CONTACT DETAILS</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p><strong>📧 Email:</strong> ${order.profiles?.email || 'N/A'}</p>
                  <p><strong>📱 Phone:</strong> <span style="font-size: 18px; color: #dc3545; font-weight: bold;">${order.shipping_address.phone}</span></p>
                  <p><strong>👤 Name:</strong> ${order.shipping_address.full_name}</p>
                </div>
                <div>
                  <p><strong>💰 Payment:</strong> ${order.payment_method === 'cod' ? '💵 Cash on Delivery' : order.payment_method.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>📅 Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>🆔 Order ID:</strong> ${order.id}</p>
                </div>
              </div>
            </div>
            
            <div class="order-details">
              <h3>📦 ORDER SUMMARY</h3>
              <table class="table">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Variant</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; text-align: right; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <p style="margin: 5px 0;">Subtotal: ₹${order.subtotal.toFixed(2)}</p>
                <p style="margin: 5px 0;">Tax (GST 18%): ₹${order.tax_amount.toFixed(2)}</p>
                <p style="margin: 5px 0;">Shipping: ₹${order.shipping_amount.toFixed(2)}</p>
                ${isCOD ? `<p style="margin: 5px 0;">COD Charges: ₹50.00</p>` : ''}
                <h2 style="color: #dc3545; margin: 10px 0; font-size: 24px;">TOTAL: ₹${order.total_amount.toFixed(2)}</h2>
              </div>
            </div>
            
            <div class="customer-info">
              <h3>🚚 DELIVERY ADDRESS</h3>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                  <strong>${order.shipping_address.full_name}</strong><br>
                  📱 ${order.shipping_address.phone}<br>
                  📍 ${order.shipping_address.address_line_1}<br>
                  ${order.shipping_address.address_line_2 ? `&nbsp;&nbsp;&nbsp;&nbsp;${order.shipping_address.address_line_2}<br>` : ''}
                  &nbsp;&nbsp;&nbsp;&nbsp;${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;${order.shipping_address.country}
                </p>
              </div>
              
              ${order.notes ? `
              <div style="margin-top: 15px;">
                <h4>📝 Customer Notes:</h4>
                <p style="background: #fff3cd; padding: 10px; border-radius: 5px; font-style: italic;">
                  "${order.notes}"
                </p>
              </div>
              ` : ''}
            </div>
            
            ${isCOD ? `
            <div class="cod-alert">
              <h3 style="color: #856404; margin-top: 0;">📋 COD ORDER PROCESSING CHECKLIST</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <h4 style="color: #856404;">IMMEDIATE ACTIONS (Within 24 hours):</h4>
                  <ul style="color: #856404; line-height: 1.8;">
                    <li>☐ <strong>Call customer: ${order.shipping_address.phone}</strong></li>
                    <li>☐ Verify order details and quantities</li>
                    <li>☐ Confirm delivery address</li>
                    <li>☐ Check product availability</li>
                  </ul>
                </div>
                <div>
                  <h4 style="color: #856404;">NEXT STEPS:</h4>
                  <ul style="color: #856404; line-height: 1.8;">
                    <li>☐ Update order status to "confirmed"</li>
                    <li>☐ Schedule packaging and dispatch</li>
                    <li>☐ Arrange delivery (3-7 business days)</li>
                    <li>☐ Send tracking details to customer</li>
                  </ul>
                </div>
              </div>
              <div style="background: #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <p style="margin: 0; color: #856404; font-weight: bold; text-align: center;">
                  💡 REMINDER: Customer will pay ₹${order.total_amount.toFixed(2)} in CASH upon delivery
                </p>
              </div>
            </div>
            ` : ''}
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="color: #155724; margin-top: 0;">🎯 QUICK ACCESS</h3>
              <p style="color: #155724; margin: 10px 0;">
                <strong>Customer Phone:</strong> <a href="tel:${order.shipping_address.phone}" style="color: #155724; font-size: 18px; text-decoration: none; font-weight: bold;">${order.shipping_address.phone}</a><br>
                <strong>Customer Email:</strong> <a href="mailto:${order.profiles?.email}" style="color: #155724; text-decoration: none;">${order.profiles?.email}</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `🚨 ${isCOD ? 'URGENT COD ORDER' : 'NEW ORDER'} #${order.order_number} - ₹${order.total_amount.toFixed(2)} - PowerFuel`,
      html,
      text: `🚨 NEW ORDER ALERT - PowerFuel

Order: #${order.order_number}
Total: ₹${order.total_amount.toFixed(2)}
Payment: ${order.payment_method === 'cod' ? 'CASH ON DELIVERY' : order.payment_method.toUpperCase()}

CUSTOMER DETAILS:
Name: ${order.shipping_address.full_name}
Phone: ${order.shipping_address.phone}
Email: ${order.profiles?.email}

DELIVERY ADDRESS:
${order.shipping_address.address_line_1}
${order.shipping_address.address_line_2 ? order.shipping_address.address_line_2 + '\n' : ''}${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}

${isCOD ? '⚠️ COD ORDER - CALL CUSTOMER WITHIN 24 HOURS TO CONFIRM!' : ''}

Order placed: ${new Date(order.created_at).toLocaleString()}`
    };
  }

  async sendOrderConfirmation(order: Order) {
    try {
      const emailTemplate = this.generateOrderConfirmationEmail(order);
      
      // In a real application, you would integrate with an email service like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Resend
      
      // For now, we'll log the email and save it to notifications
      console.log('📧 Sending order confirmation email to customer:', {
        to: order.profiles?.email,
        subject: emailTemplate.subject
      });

      // Save notification to database
      await supabase
        .from('notifications')
        .insert({
          user_id: order.user_id,
          type: 'order_confirmed',
          title: 'Order Confirmed',
          message: `Your order #${order.order_number} has been confirmed.`,
          data: { order_id: order.id, order_number: order.order_number }
        });

      return { success: true };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error };
    }
  }

  async sendAdminOrderNotification(order: Order) {
    try {
      const emailTemplate = this.generateAdminOrderNotification(order);
      
      // In a real application, send email to admin
      console.log('🚨 SENDING ADMIN ORDER NOTIFICATION:', {
        to: this.adminEmail,
        subject: emailTemplate.subject,
        orderNumber: order.order_number,
        customerPhone: order.shipping_address.phone,
        customerEmail: order.profiles?.email,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        isCOD: order.payment_method === 'cod'
      });

      // You can also save this to a notifications table for admin dashboard
      await supabase
        .from('admin_notifications')
        .insert({
          type: 'new_order',
          title: `New ${order.payment_method === 'cod' ? 'COD ' : ''}Order`,
          message: `Order #${order.order_number} received from ${order.shipping_address.full_name}`,
          data: { 
            order_id: order.id, 
            order_number: order.order_number,
            customer_name: order.shipping_address.full_name,
            customer_phone: order.shipping_address.phone,
            customer_email: order.profiles?.email,
            total_amount: order.total_amount,
            payment_method: order.payment_method,
            is_cod: order.payment_method === 'cod',
            admin_email: this.adminEmail
          }
        })
        .catch(() => {}); // Ignore if table doesn't exist

      return { success: true };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error };
    }
  }

  async sendOrderStatusUpdate(order: Order, newStatus: string) {
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared.',
        processing: 'Your order is being processed and will ship soon.',
        shipped: 'Your order has been shipped and is on its way!',
        delivered: 'Your order has been delivered successfully!',
        cancelled: 'Your order has been cancelled.',
        refunded: 'Your order has been refunded.'
      };

      const message = statusMessages[newStatus as keyof typeof statusMessages] || `Your order status has been updated to ${newStatus}.`;

      console.log('📧 Sending order status update:', {
        orderId: order.id,
        status: newStatus,
        message,
        customerEmail: order.profiles?.email
      });

      // Save notification
      await supabase
        .from('notifications')
        .insert({
          user_id: order.user_id,
          type: `order_${newStatus}`,
          title: `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          message: `Order #${order.order_number}: ${message}`,
          data: { order_id: order.id, order_number: order.order_number, status: newStatus }
        });

      return { success: true };
    } catch (error) {
      console.error('Error sending order status update:', error);
      return { success: false, error };
    }
  }
}

export const emailService = new EmailService();