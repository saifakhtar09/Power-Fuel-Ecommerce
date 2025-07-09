import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'PowerFuel - Premium Protein Supplements',
  description = 'Premium protein powders and supplements designed for athletes who demand excellence. Fuel your workouts, accelerate recovery, and achieve your fitness goals.',
  keywords = 'protein powder, supplements, fitness, bodybuilding, nutrition, whey protein, mass gainer',
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  noIndex = false
}) => {
  const fullTitle = title.includes('PowerFuel') ? title : `${title} | PowerFuel`;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PowerFuel" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="PowerFuel" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0066ff" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://images.pexels.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "PowerFuel",
          "description": description,
          "url": window.location.origin,
          "logo": `${window.location.origin}/logo.png`,
          "sameAs": [
            "https://facebook.com/powerfuel",
            "https://twitter.com/powerfuel",
            "https://instagram.com/powerfuel"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-POWERFUEL",
            "contactType": "customer service",
            "email": "support@powerfuel.com"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;