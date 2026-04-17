export const dynamic = "force-dynamic";
import CheckOutFrom from '../../components/Home/CheckoutFrom';
import { getCart } from '@/action/server/cart';

const checkOutPage = async () => {
  let cartItems = [];
  try {
    cartItems = await getCart();
  } catch (err) {
    console.error("Failed to fetch cart:", err);
  }

  const formattedItems = cartItems.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  if (!formattedItems.length) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold mb-5">Checkout Page</h2>
      <CheckOutFrom cartItems={formattedItems} />
    </div>
  );
};

export default checkOutPage;