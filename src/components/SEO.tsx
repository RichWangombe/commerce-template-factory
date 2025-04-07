
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  product?: {
    name: string;
    description: string;
    price: number;
    image: string;
    sku: string;
    brand?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export const SEO = ({ title, description, image, product }: SEOProps) => {
  const baseTitle = "TechStore - Premium Electronics and Gadgets";
  const baseDescription = "Shop the latest electronics, gadgets, and tech accessories with free shipping and amazing customer service.";
  const baseImage = "/og-image.png";

  const pageTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const pageDescription = description || baseDescription;
  const pageImage = image || baseImage;

  const structuredData = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "TechStore"
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0
      }
    }),
    ...(product.category && {
      category: product.category
    })
  } : null;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
