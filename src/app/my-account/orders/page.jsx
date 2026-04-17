import { getserverSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/authOptions";
import OrderCard from "../../../components/Card/OrderCard";
import { dbConnect, Collection } from "../../lib/dbConnect";

export default async function MyOrdersPage() {
  const session = await getserverSession(authOptions);

  if (!session) redirect("/login");

  const collection = await dbConnect(Collection.ORDER);

  const orders = await collection
    .find({ "user.email": session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

    const serializedOrders = orders.map((order) => ({
  ...order,
  _id: order._id.toString(), // ✅ fix ObjectId
  createdAt: order.createdAt?.toString(), // ✅ fix Date
}));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && <p>No orders found</p>}

     {serializedOrders.map((order) => (
  <OrderCard key={order._id} order={order} />
))}
    </div>
  );
}