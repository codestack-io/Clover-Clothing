"use server";

import { Collection, dbConnect } from "../../app/lib/dbConnect";
import { ObjectId } from "mongodb";

export const getProducts = async () => {
  const collection = await dbConnect(Collection.PRODUCTS);
  const products = await collection.find().toArray();

  return products.map((product) => ({
    ...product,
    _id: product._id.toString(), // convert ObjectId for React
  }));
};

export const getSingleProduct = async (id) => {
  if (!id || id.length !== 24) return null;

  const collection = await dbConnect(Collection.PRODUCTS);
  const query = { _id: new ObjectId(id) };
  const product = await collection.findOne(query);
return JSON.parse(JSON.stringify(product));
};