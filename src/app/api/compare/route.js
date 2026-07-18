import { ObjectId } from "mongodb";
import { dbConnect, Collection } from "../../lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const cottonType = searchParams.get("cottonType");
    const id = searchParams.get("id");

    const collection = await dbConnect(Collection.PRODUCTS);

    const query = { cottonType };

    if (id && ObjectId.isValid(id)) {
      query._id = { $ne: new ObjectId(id) };
    }

    const products = await collection.find(query).limit(5).toArray();

    return Response.json(products);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}