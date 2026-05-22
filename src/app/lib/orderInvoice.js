export const generateInvoiceHTML = (order) => {
  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;">
        ${item.title}
      </td>

      <td style="padding:8px;border:1px solid #ddd;text-align:center;">
        ${item.quantity}
      </td>

      <td style="padding:8px;border:1px solid #ddd;text-align:right;">
        ৳${item.price}
      </td>

      <td style="padding:8px;border:1px solid #ddd;text-align:right;">
        ৳${item.price * item.quantity}
      </td>
    </tr>
  `
    )
    .join("");

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const shipping = order.shipping ?? 0;
  const tax = order.tax ?? 0;

  const total = subtotal + shipping + tax;

  return `
    <div style="font-family:Arial;padding:20px;max-width:700px;margin:auto;">

      <h2 style="color:#16a34a;">
        Thank you for your order
      </h2>

      <p>
        Hello ${order?.user?.name || "Customer"},
      </p>

      <p>
        Your order has been confirmed successfully.
      </p>

      <p>
        <strong>Payment Method:</strong>
        ${order.paymentMethod}
      </p>

      <h3>Shipping Address</h3>

      <p>
        ${order?.user?.address},
        ${order?.user?.city},
        ${order?.user?.postalCode}
      </p>

      <h3>Order Items</h3>

      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:10px;
        "
      >
        <thead style="background:#f3f4f6;">
          <tr>
            <th style="border:1px solid #ddd;padding:8px;text-align:left;">
              Product
            </th>

            <th style="border:1px solid #ddd;padding:8px;text-align:center;">
              Qty
            </th>

            <th style="border:1px solid #ddd;padding:8px;text-align:right;">
              Price
            </th>

            <th style="border:1px solid #ddd;padding:8px;text-align:right;">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div style="margin-top:20px;">
        <p><strong>Subtotal:</strong> ৳${subtotal}</p>

        <p><strong>Shipping:</strong> ৳${shipping}</p>

        <p><strong>Tax:</strong> ৳${tax}</p>

        <h2 style="color:#16a34a;">
          Total: ৳${total}
        </h2>
      </div>

      <p style="margin-top:30px;color:#666;">
        Thank you for shopping with us.
      </p>
    </div>
  `;
};