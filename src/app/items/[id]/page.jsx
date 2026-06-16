import { getSingleProduct } from "@/action/server/product";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "@/components/productAction";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    return {
      title: "Item Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { name, price, cottonType, discount = 0, image } = product;
  const discountPrice = price - (price * discount) / 100;
  const description = `${name} made with premium ${cottonType}. ${
    discount > 0
      ? `Now available for ৳${discountPrice.toFixed(0)} (${discount}% OFF).`
      : `Available now for ৳${price}.`
  }`;

  return {
    title: `${name} | Clover Clothing`,
    description,
    openGraph: {
      title: name,
      description,
      images: [{ url: image || "" }],
    },
  };
}

const ItemDetails = async ({ params }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h2 className="text-2xl font-semibold text-red-500">Item Not Found</h2>
        <Link
          href="/items"
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          ← Back to Items
        </Link>
      </div>
    );
  }

  const { name, price, cottonType, sold, image, discount = 0, color, description } = product;
  const discountPrice = price - (price * discount) / 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Back Button */}
      <Link
        href="/items"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition mb-6 font-medium"
      >
        ← Back to Items
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

        {/* Product Image */}
        <div className="relative w-full h-[320px] sm:h-[480px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            className="object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              ৳{discount > 0 ? discountPrice.toFixed(0) : price}
            </span>
            {discount > 0 && (
              <span className="text-lg text-gray-400 line-through">৳{price}</span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 leading-relaxed">{description}</p>
          )}

          {/* Key Specifications */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm sm:text-base">
            <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Cotton Type</span>
              <span className="font-medium">{cottonType}</span>
              {color && (
                <>
                  <span className="text-gray-500">Color</span>
                  <span className="font-medium">{color}</span>
                </>
              )}
              <span className="text-gray-500">Units Sold</span>
              <span className="font-medium">{sold || 0} pieces</span>
              {discount > 0 && (
                <>
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-red-500">{discount}% OFF</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <ProductActions
              product={{
                ...product,
                id: product?._id?.toString?.() || product?._id,
              }}
            />
          </div>

          {/* Compare */}
          <Link href={`/compare/${product._id}`}>
            <button className="w-full sm:w-auto border-2 border-black text-black px-5 py-3 rounded-lg hover:bg-black hover:text-white transition">
              Compare This Item
            </button>
          </Link>
        </div>
      </div>

      {/* Related Items Placeholder – linked to same category */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">More from {cottonType}</h2>
        <Link
          href={`/items?category=${encodeURIComponent(cottonType)}`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Browse {cottonType} Items →
        </Link>
      </div>
    </div>
  );
};

export default ItemDetails;
