
import { PromotionCard } from "@/components/PromotionCard";

interface PromotionsSectionProps {
  promotions: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    backgroundColor?: string;
    ctaText?: string;
  }[];
}

export const PromotionsSection = ({ promotions }: PromotionsSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold">Promotions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-group">
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              id={promo.id}
              title={promo.title}
              subtitle={promo.subtitle}
              image={promo.image}
              backgroundColor={promo.backgroundColor}
              ctaText={promo.ctaText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
