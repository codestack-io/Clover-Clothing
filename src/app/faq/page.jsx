import FAQSection from "@/components/FAQ/FAQSection";

export const metadata = {
  title: "FAQs | Clover Clothing",
  description:
    "Answers to common questions about orders, shipping, returns, sizing, and payments at Clover Clothing.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <FAQSection />
    </main>
  );
}