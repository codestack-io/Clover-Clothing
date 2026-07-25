export default function LatestProducts({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-500">No products yet</p>
        <p className="mt-1 text-xs text-slate-400">Newly added products will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li key={product.id} className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-100" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">{product.name}</p>
            <p className="text-xs text-slate-400">{product.category}</p>
          </div>
          <span className="text-sm font-semibold text-slate-800">${product.price}</span>
        </li>
      ))}
    </ul>
  );
}