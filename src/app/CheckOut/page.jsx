import CheckOutFrom from '../../components/Home/CheckOutFrom';
import { getCart } from '@/Action/Server/cart';

const CheckOutPage = async () => {
  const cartItems = await getCart();

  const formattedItems = cartItems.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return (
    <div>
      <h2 className="text-4xl font-bold">Checkout Page</h2>
      <CheckOutFrom cartItems={formattedItems} />
    </div>
  );
};

export default CheckOutPage;