export const generateInvoiceHTML = (order) => {
  return `
    <div 
      style="
        font-family: Arial, sans-serif;
        padding: 20px;
        max-width: 800px;
        margin: auto;
      "
    >

      <h1 style="text-align:center; color:#111;">
        Invoice
      </h1>

      <hr />

      <h2>Customer Information</h2>

      <p>
        <strong>Order ID:</strong> 
        ${order._id}
      </p>

      <p>
        <strong>Customer Name:</strong> 
        ${order.user?.name || "Customer"}
      </p>

      <p>
        <strong>Email:</strong> 
        ${order.user?.email || "No Email"}
      </p>

      <p>
        <strong>Phone:</strong> 
        ${order.phone || "N/A"}
      </p>

      <p>
        <strong>Address:</strong> 
        ${order.address || ""}
      </p>

      <p>
        <strong>City:</strong> 
        ${order.city || ""}
      </p>

      <p>
        <strong>Postal Code:</strong> 
        ${order.postalCode || ""}
      </p>

      <hr />

      <h2>Order Information</h2>

      <p>
        <strong>Payment Method:</strong> 
        ${order.paymentMethod || "N/A"}
      </p>

      <p>
        <strong>Order Status:</strong> 
        ${order.status || "pending"}
      </p>

      <p>
        <strong>Delivery Status:</strong> 
        ${order.deliveryStatus || "processing"}
      </p>

      <hr />

      <h2>Products</h2>

      <table
        border="1"
        cellpadding="10"
        cellspacing="0"
        width="100%"
        style="
          border-collapse: collapse;
          margin-top: 20px;
        "
      >
        <thead style="background:#f5f5f5;">
          <tr>
            <th align="left">Product</th>
            <th align="center">Quantity</th>
            <th align="right">Price</th>
          </tr>
        </thead>

        <tbody>
          ${order.items
            .map(
              (item) => `
                <tr>
                  <td>${item.title}</td>
                  <td align="center">${item.quantity}</td>
                  <td align="right">৳${item.price}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>

      <h2 style="margin-top: 20px;">
        Total Price: ৳${order.totalPrice || 0}
      </h2>

      <br />

      <p style="text-align:center;">
        Thank you for shopping with us ❤️
      </p>

    </div>
  `;
};