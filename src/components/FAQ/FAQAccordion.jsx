"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FAQItem from "./FAQItem";

/**
 * FAQAccordion
 * Renders a list of FAQItem rows and enforces the "only one open at a
 * time" rule via a single openId piece of state. Also animates rows
 * in/out when the parent's filtered `faqs` list changes (search or
 * category switching), so results never just pop in.
 */
function FAQAccordion({ faqs }) {
  const [openId, setOpenId] = useState(null);

  const handleToggle = useCallback((id) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col gap-3" role="presentation">
      <AnimatePresence initial={false} mode="popLayout">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
          >
            <FAQItem
              faq={faq}
              index={index}
              isOpen={openId === faq.id}
              onToggle={handleToggle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default memo(FAQAccordion);