import { dbConnect, Collection } from "../../../app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const cottonType = searchParams.get("cottonType");
  const id = searchParams.get("id");

  const collection = await dbConnect(Collection.PRODUCTS);

  const products = await collection
    .find({
      cottonType,
      _id: { $ne: new ObjectId(id) }
    })
    .limit(5)
    .toArray();

  return Response.json(products);
}