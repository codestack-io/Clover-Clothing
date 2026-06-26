import Compare from "../../../components/Compare/Compare";
import { dbConnect, Collection } from "../../../app/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function ComparePage({ params }) {
     const resolvedParams = await params; // unwrap the promise
  const id = resolvedParams.id;
    console.log("Params ID:", id);
  const collection = await dbConnect(Collection.PRODUCTS);

  // fetch selected product by ObjectId
  const selectedProduct = await collection.findOne({
    _id: new ObjectId(id)
  });
  console.log("URL id:", id);
console.log("Selected product:", await collection.findOne({ _id: new ObjectId(id) }));

  // handle product not found
  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-semibold text-red-500">
          Product Not Found
        </h2>
      </div>
    );
  }

  // convert _id to string so client component can use it
  selectedProduct._id = selectedProduct._id.toString();

  return <Compare selectedProduct={selectedProduct} />;
}