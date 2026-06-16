import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/authOptions";
import OrderCard from "../../../components/Card/OrderCard";
import { dbConnect, Collection } from "../../lib/dbConnect";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const collection = await dbConnect(Collection.ORDER);

  const orders = await collection
    .find({ "user.email": session.user.email })
    .sort({ createdAt: -1 })
    .toArray();

  const serializedOrders = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    createdAt: order.createdAt?.toString(),
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 && <p>No orders found</p>}

        <div className="space-y-4">
          {serializedOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}