"use server"
import { ObjectId } from "mongodb";
import { authOptions } from "../../app/lib/authOptions";
import { getServerSession } from "next-auth";


const { dbConnect, Collection } = require("../../app/lib/authOptions")



export const handleCart = async ({ productId,size }) => {

  if (!size) {
  return { success: false, message: "Size is required" };
}

  const { user } = await getServerSession(authOptions) || {};
  if (!user) return { success: false };

  const cartCollection = await dbConnect(Collection.CART);
const query = { email: user?.email, productId, size };

  const isAdded = await cartCollection.findOne(query);

  if (isAdded) {

    const updatedData = {
      $inc: { quantity: 1 }
    };

    const result = await cartCollection.updateOne(query, updatedData);

    return { success: Boolean(result.modifiedCount) };

  } else {

    const productCollection = await dbConnect(Collection.PRODUCTS);

    const product = await productCollection.findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

   const newData = {
  productId: product._id.toString(),
  email: user?.email,
  title: product.name,
  quantity: 1,
  image: product.image,
  price: product.price,
  username: user?.name,
  size, 
};

    const result = await cartCollection.insertOne(newData);

    return { success: result.acknowledged };
  }
};
export const getCart = (async () =>{
    const {user} = (await getServerSession(authOptions))|| {} ;
    if(!user) return [];
     
    const cartCollection = await dbConnect(Collection.CART);
    const query = {email:user?.email};
    const result= await cartCollection.find(query).toArray();
     const cart = result.map(item => ({
    ...item,
    _id: item._id.toString(),
      productId: item.productId?.toString() || null,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    title: item?.title || "Unknown Product",
    image: item?.image || "/placeholder.png",
  }));

  return cart;
})
export const placeOrderAndUpdateSold = async () => {
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) return { success: false };

  const cartCollection = await dbConnect(Collection.CART);
  const productCollection = await dbConnect(Collection.PRODUCTS);

  const cartItems = await cartCollection.find({ email: user.email }).toArray();

  if (!cartItems.length) {
    return { success: false, message: "Cart is empty" };
  }

  for (const item of cartItems) {
    await productCollection.updateOne(
      { _id: new ObjectId(item.productId) },
      {
        $inc: {
          sold: item.quantity, // ✅ THIS is your sold count fix
        },
      }
    );
  }
  console.log(item.productId);

  // clear cart after order
  await cartCollection.deleteMany({ email: user.email });

  return { success: true };
};
export const deleteItemsFromCart = async(id)=>{
    
  const cartCollection = await dbConnect(Collection.CART);
    const {user} = (await getServerSession(authOptions))|| {} ;
    if(!user) return {success:false};

    if (!ObjectId.isValid(id)) {
  return { success: false };
}

    const query = {_id: new ObjectId(id), email: user?.email}

    const result = await  cartCollection.deleteOne(query);

    // if(Boolean(result.deletedCount)){
    //   revalidatePath("/cart")
    // }
    return {success: Boolean(result.deletedCount)}
};

export const increaseItemDb = async(id,quantity)=>{
  const {user} = (await getServerSession(authOptions))|| {} ;
    if(!user) return {success:false};

    if(quantity>10){   
     return {
        success:false, message: "You cannot bye 10 products at a time"
      }
    }
     const cartCollection = await dbConnect(Collection.CART);
    const query = {_id: new ObjectId(id), email: user?.email}

    const updatedData = {
        $inc:{
            quantity: 1
        }
      }
    const result = await  cartCollection.updateOne(query,updatedData);

    return{success:Boolean(result.modifiedCount) }

}

export const decreaseItemDb = async(id,quantity)=>{
  const {user} = (await getServerSession(authOptions))|| {} ;
    if(!user) return {success:false};

    if(quantity <= 1){
     return {
        success:false, message: "quantity cannot be empty"
      }
    }
     const cartCollection = await dbConnect(Collection.CART);
     const query = {_id: new ObjectId(id), email: user?.email}

    const updatedData = {
        $inc:{
            quantity: -1
        }
      }
    const result = await  cartCollection.updateOne(query,updatedData);

    return{success:Boolean(result.modifiedCount) }

};
export const clearCart = async ()=>{
   const {user} = (await getServerSession(authOptions))|| {} ;
    if(!user) return {success:false};
     const query = {email:user?.email};
     const cartCollection = await dbConnect(Collection.CART);
    const result= await cartCollection.deleteMany(query);
    return result;
    
}