interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

export class Analytics {
  private static isInitialized = false;

  static init(): void {
    if (this.isInitialized || import.meta.env.DEV) return;

    // Initialize Google Analytics
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    if (gaId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', gaId);
      
      (window as any).gtag = gtag;
    }

    // Initialize Hotjar
    const hotjarId = import.meta.env.VITE_HOTJAR_ID;
    if (hotjarId) {
      (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj = h.hj || function(...args: any[]) { (h.hj.q = h.hj.q || []).push(args); };
        h._hjSettings = { hjid: hotjarId, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script'); r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }

    this.isInitialized = true;
  }

  static track(event: AnalyticsEvent): void {
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', event);
      return;
    }

    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId
      });
    }

    // Custom analytics endpoint
    this.sendToCustomAnalytics(event);
  }

  private static async sendToCustomAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Predefined events
  static trackPageView(page: string, userId?: string): void {
    this.track({
      name: 'page_view',
      properties: { page },
      userId
    });
  }

  static trackPurchase(orderId: string, value: number, currency: string = 'USD', userId?: string): void {
    this.track({
      name: 'purchase',
      properties: {
        transaction_id: orderId,
        value,
        currency
      },
      userId
    });
  }

  static trackAddToCart(productId: string, productName: string, value: number, userId?: string): void {
    this.track({
      name: 'add_to_cart',
      properties: {
        item_id: productId,
        item_name: productName,
        value
      },
      userId
    });
  }

  static trackSignUp(method: string, userId?: string): void {
    this.track({
      name: 'sign_up',
      properties: { method },
      userId
    });
  }

  static trackLogin(method: string, userId?: string): void {
    this.track({
      name: 'login',
      properties: { method },
      userId
    });
  }
}

// Performance tracking
export const trackPerformance = () => {
  if (import.meta.env.DEV) return;

  // Track Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => Analytics.track({
      name: 'web_vital_cls',
      properties: { value: metric.value }
    }));

    getFID((metric) => Analytics.track({
      name: 'web_vital_fid',
      properties: { value: metric.value }
    }));

    getFCP((metric) => Analytics.track({
      name: 'web_vital_fcp',
      properties: { value: metric.value }
    }));

    getLCP((metric) => Analytics.track({
      name: 'web_vital_lcp',
      properties: { value: metric.value }
    }));

    getTTFB((metric) => Analytics.track({
      name: 'web_vital_ttfb',
      properties: { value: metric.value }
    }));
  });
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}