
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQData = [
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Items must be unused and in their original packaging."
  },
  {
    question: "How long does shipping take?",
    answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also view tracking information in your account dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, PayPal, M-Pesa, and various local payment methods."
  }
];

export const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        {FAQData.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
