export default function LatestProducts({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-500">
          No products yet
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Newly added products will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex items-center gap-3"
        >

          {/* Product Image */}

          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name || "Product"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                —
              </div>
            )}

          </div>

          {/* Product Information */}

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-medium text-slate-700">
              {product.name || "Unnamed Product"}
            </p>

            <p className="truncate text-xs text-slate-400">
              {product.category || "Product"}
            </p>

          </div>

          {/* Price */}

          <span className="shrink-0 text-sm font-semibold text-slate-800">
            ৳{Number(product.price || 0).toLocaleString("en-BD")}
          </span>

        </li>
      ))}
    </ul>
  );
}