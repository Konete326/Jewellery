import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const defaultFaqs = [
  {
    question: "What gold purity standards are used in your creations?",
    answer:
      "Every piece is handcrafted strictly in certified 22K (91.6% hallmark purity) or solid 24K pure gold, accompanied by an official physical Certificate of Authenticity and weight ledger.",
  },
  {
    question: "Can I commission a bespoke bridal jewellery heirloom?",
    answer:
      "Yes. Our master goldsmiths work directly with you through private sketch consultation, 3D wax design, and meticulous artisanal fabrication in our Saddar Karachi workshop.",
  },
  {
    question: "Do you offer private viewing appointments in Saddar, Karachi?",
    answer:
      "Yes. You can reserve an appointment online or via WhatsApp concierge to visit our private salon at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi.",
  },
  {
    question: "How are polki and diamond gemstones authenticated?",
    answer:
      "We source natural, unenhanced uncut Polki diamonds and certified gemstones, each individually inspected under magnification and recorded in your heirloom dossier.",
  },
];

export default function FAQSection({
  faqs = defaultFaqs,
  category = "FAQ",
  title = "Frequently Asked Questions",
  subtitle = "Direct answers regarding our artisanal standards, bespoke commissions, and atelier heritage.",
  className = "",
}) {
  return (
    <section className={cn("w-full py-12 md:py-16", className)}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          {category && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs font-mono uppercase tracking-wider mb-3">
              <span>{category}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-serif font-light tracking-tight text-foreground mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 sm:p-8 shadow-xs">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/60 last:border-b-0">
                <AccordionTrigger className="text-left font-serif text-sm sm:text-base font-normal text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed pb-4 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
