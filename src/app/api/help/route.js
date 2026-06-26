import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/lib/authOptions";
import { dbConnect, Collection } from "../../../app/lib/dbConnect";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collection = await dbConnect(Collection.HELP);

  const isAdmin = session.user.role === "admin";

  const query = isAdmin
    ? {}
    : { userId: session.user.id };

  const data = await collection.find(query).toArray();

  return Response.json(data);
}
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = await req.json();

  const collection = await dbConnect(Collection.HELP);

  await collection.insertOne({
    userId: session.user.id,
    email: session.user.email,
    question,
    answer: "",
    status: "pending",
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}