/**
 * faqData.js
 * -----------------------------------------------------------------------
 * Single source of truth for FAQ content. Kept as plain data (not JSX) so
 * it can later be swapped for a CMS fetch, a database query, or fed into
 * an AI assistant's context window without touching any component code.
 *
 * Shape of each FAQ entry:
 * {
 *   id: string          // stable unique id, used for aria-controls / keys
 *   question: string
 *   answer: string
 *   category: string    // must match a `categories[].id` below
 *   keywords: string[]  // extra search terms not present in question/answer
 * }
 */

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
// `icon` stores a *key*, not a component — keeps this file framework/UI
// agnostic. FAQCategories.jsx maps the key to an actual lucide-react icon.
export const categories = [
  { id: "all", label: "All", icon: "Grid2x2" },
  { id: "orders", label: "Orders", icon: "Package" },
  { id: "shipping", label: "Shipping", icon: "Truck" },
  { id: "returns", label: "Returns", icon: "RotateCcw" },
  { id: "payments", label: "Payments", icon: "CreditCard" },
  { id: "products", label: "Products", icon: "Shirt" },
  { id: "account", label: "Account", icon: "UserRound" },
];

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export const faqs = [
  // Orders --------------------------------------------------------------
  {
    id: "ord-1",
    question: "How do I track my order?",
    answer:
      "Once your order ships, we'll email and text you a tracking link. You can also find it anytime under Account → Orders by selecting the order and tapping 'Track package'.",
    category: "orders",
    keywords: ["tracking", "track order", "shipment status", "where is my order"],
  },
  {
    id: "ord-2",
    question: "Can I cancel my order?",
    answer:
      "You can cancel for free within 1 hour of placing it — go to Account → Orders and select 'Cancel order'. After that window, the order has usually entered packing and can no longer be cancelled, but you're welcome to return it once delivered.",
    category: "orders",
    keywords: ["cancel", "stop order", "change my mind"],
  },
  {
    id: "ord-3",
    question: "Can I change my delivery address after ordering?",
    answer:
      "If your order hasn't shipped yet, you can update the address from Account → Orders → Edit delivery details. Once it's out for delivery, we're unable to redirect it, so please double-check your address at checkout.",
    category: "orders",
    keywords: ["address", "change address", "wrong address", "delivery details"],
  },
  {
    id: "ord-4",
    question: "Can I order without creating an account?",
    answer:
      "Yes — guest checkout is available on every order. Creating an account just lets you save addresses, track orders in one place, and check out faster next time.",
    category: "orders",
    keywords: ["guest checkout", "no account", "sign up"],
  },
  {
    id: "ord-5",
    question: "I received the wrong item. What should I do?",
    answer:
      "We're sorry about that. Contact our support team with your order number and a photo of the item received, and we'll send the correct piece out immediately at no extra cost, along with a prepaid label for the mix-up.",
    category: "orders",
    keywords: ["wrong item", "incorrect order", "mistake"],
  },

  // Shipping --------------------------------------------------------------
  {
    id: "shp-1",
    question: "How long does shipping take?",
    answer:
      "Standard delivery takes 3–5 business days within the country, and 1–2 business days for Express. You'll see exact estimates for your address at checkout before you pay.",
    category: "shipping",
    keywords: ["delivery time", "how long", "eta", "arrival"],
  },
  {
    id: "shp-2",
    question: "Is shipping free?",
    answer:
      "Standard shipping is free on all orders over $50. Orders below that threshold have a flat $4.99 shipping fee, and Express delivery is available for an additional charge at checkout.",
    category: "shipping",
    keywords: ["free shipping", "shipping cost", "shipping fee"],
  },
  {
    id: "shp-3",
    question: "Do you ship internationally?",
    answer:
      "Yes, we currently ship to over 30 countries. International delivery typically takes 7–14 business days, and any customs duties are calculated and shown to you at checkout — no surprise fees at your door.",
    category: "shipping",
    keywords: ["international", "worldwide", "customs", "overseas"],
  },
  {
    id: "shp-4",
    question: "What happens if I miss my delivery?",
    answer:
      "Our courier will attempt delivery up to twice and leave a notice with rescheduling instructions. Parcels are held at a local depot for 7 days before being returned to us, after which we'll issue a refund.",
    category: "shipping",
    keywords: ["missed delivery", "redelivery", "courier"],
  },
  {
    id: "shp-5",
    question: "Can I choose a specific delivery date or time?",
    answer:
      "Right now we don't offer scheduled delivery windows, but Express orders placed before 12 PM are typically delivered the next business day in most metro areas.",
    category: "shipping",
    keywords: ["scheduled delivery", "delivery date", "delivery time slot"],
  },

  // Returns --------------------------------------------------------------
  {
    id: "ret-1",
    question: "How do I return an item?",
    answer:
      "Go to Account → Orders, select the item, and choose 'Start a return'. Print the prepaid label, pack the item with tags attached, and drop it at any partner courier point. Refunds process once we receive it.",
    category: "returns",
    keywords: ["return item", "send back", "return process"],
  },
  {
    id: "ret-2",
    question: "How long does a refund take?",
    answer:
      "Refunds are issued within 2 business days of us receiving your return, and typically appear on your statement within 5–7 business days depending on your bank or card provider.",
    category: "returns",
    keywords: ["refund time", "money back", "how long refund"],
  },
  {
    id: "ret-3",
    question: "Can I exchange a product instead of returning it?",
    answer:
      "Yes — select 'Exchange' instead of 'Return' when starting the process, choose your new size or color, and we'll ship the replacement as soon as the original is scanned by the courier, at no extra cost.",
    category: "returns",
    keywords: ["exchange", "swap size", "different size"],
  },
  {
    id: "ret-4",
    question: "What is your return window?",
    answer:
      "You have 30 days from the delivery date to return an item, as long as it's unworn, unwashed, and has its original tags attached. Final-sale items are marked clearly on the product page and aren't eligible.",
    category: "returns",
    keywords: ["return policy", "return window", "days to return", "final sale"],
  },
  {
    id: "ret-5",
    question: "Do I have to pay for return shipping?",
    answer:
      "Returns within the country are free using our prepaid label. For international orders, a small return shipping fee is deducted from your refund unless the return is due to our error.",
    category: "returns",
    keywords: ["return shipping cost", "free returns"],
  },

  // Payments --------------------------------------------------------------
  {
    id: "pay-1",
    question: "What payment methods are accepted?",
    answer:
      "We accept all major debit and credit cards, PayPal, Apple Pay, Google Pay, and popular local wallets shown at checkout depending on your region.",
    category: "payments",
    keywords: ["payment options", "cards", "paypal", "apple pay", "google pay"],
  },
  {
    id: "pay-2",
    question: "Do you offer Cash on Delivery?",
    answer:
      "Cash on Delivery is available for orders under $150 in select regions. You'll see the option at checkout automatically if it's available for your address.",
    category: "payments",
    keywords: ["cod", "cash on delivery", "pay on arrival"],
  },
  {
    id: "pay-3",
    question: "Is it safe to save my card details?",
    answer:
      "Yes. Card details are tokenized and stored by our PCI-DSS compliant payment processor — we never see or store your full card number on our own servers.",
    category: "payments",
    keywords: ["card safety", "secure payment", "save card", "pci"],
  },
  {
    id: "pay-4",
    question: "Can I pay in installments?",
    answer:
      "Yes, we support buy-now-pay-later through Klarna and Afterpay on orders over $35. Just select it as your payment method at checkout to see your installment plan.",
    category: "payments",
    keywords: ["installments", "klarna", "afterpay", "pay later", "bnpl"],
  },
  {
    id: "pay-5",
    question: "Why was my payment declined?",
    answer:
      "This is usually due to a billing address mismatch, insufficient funds, or your bank flagging the transaction. Try a different payment method, or contact your bank to authorize the charge, then retry checkout.",
    category: "payments",
    keywords: ["declined", "payment failed", "card error"],
  },

  // Products --------------------------------------------------------------
  {
    id: "prd-1",
    question: "How do I know my size?",
    answer:
      "Every product page has a 'Size guide' link with detailed measurements for that specific style, since fits vary between fabrics. When between two sizes, our guide notes whether the piece runs small, true-to-size, or oversized.",
    category: "products",
    keywords: ["sizing", "size chart", "size guide", "fit"],
  },
  {
    id: "prd-2",
    question: "Are your clothes true to size?",
    answer:
      "Most of our pieces are true to size, but relaxed and oversized fits are labeled clearly in the product description. Check the size guide and customer photos on each product page for the most accurate picture.",
    category: "products",
    keywords: ["true to size", "runs small", "runs large"],
  },
  {
    id: "prd-3",
    question: "What fabric care instructions should I follow?",
    answer:
      "Care instructions are listed on the product page and on the garment's inner label. As a general rule, cold wash and air dry keep colors and fit intact longer than hot washing or tumble drying.",
    category: "products",
    keywords: ["fabric care", "washing instructions", "laundry"],
  },
  {
    id: "prd-4",
    question: "Do you restock sold-out items?",
    answer:
      "Popular styles are often restocked within 2–4 weeks. Tap 'Notify me' on the product page and we'll email you the moment it's back, before it's announced anywhere else.",
    category: "products",
    keywords: ["restock", "sold out", "back in stock", "notify me"],
  },
  {
    id: "prd-5",
    question: "Are your materials sustainably sourced?",
    answer:
      "We're steadily increasing our use of organic cotton, recycled polyester, and responsibly sourced fibers. Each product page lists the fabric composition so you can check before you buy.",
    category: "products",
    keywords: ["sustainable", "eco friendly", "organic cotton", "materials"],
  },

  // Account --------------------------------------------------------------
  {
    id: "acc-1",
    question: "How do I reset my password?",
    answer:
      "Select 'Forgot password' on the sign-in screen and enter your email. We'll send a reset link that's valid for 30 minutes — if it expires, just request a new one.",
    category: "account",
    keywords: ["reset password", "forgot password", "login issue"],
  },
  {
    id: "acc-2",
    question: "How do I delete my account?",
    answer:
      "Go to Account → Settings → Privacy and select 'Delete account'. This permanently removes your saved details; note that past order history is retained for tax and legal record-keeping.",
    category: "account",
    keywords: ["delete account", "close account", "remove data"],
  },
  {
    id: "acc-3",
    question: "Can I have more than one shipping address saved?",
    answer:
      "Yes, you can save unlimited addresses under Account → Addresses and pick one at checkout, or set a default for faster future orders.",
    category: "account",
    keywords: ["saved addresses", "multiple addresses", "default address"],
  },
  {
    id: "acc-4",
    question: "How do I unsubscribe from marketing emails?",
    answer:
      "Click 'Unsubscribe' at the bottom of any marketing email, or go to Account → Settings → Notifications and turn off promotional emails. You'll still receive order and shipping updates.",
    category: "account",
    keywords: ["unsubscribe", "stop emails", "marketing emails", "notifications"],
  },
];