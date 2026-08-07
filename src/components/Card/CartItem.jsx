"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { decreaseItemDb, deleteItemsFromCart, increaseItemDb } from "../../action/server/cart";
import Swal from "sweetalert2";

const CartItem = ({ item, removeItem,updateQuantity}) => {
  const { image, title, quantity, price,_id } = item;
  const [loading,setLoading] = useState(false);
  const handleDeleteCart = async ()=>{
   Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then(async(result) => {
  if (result.isConfirmed) {
    const result = await deleteItemsFromCart(_id);
    
    if(result.success){
      removeItem(_id);
      Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
    }else{
       Swal.fire({
      title: "Oohoo!",
      text: "Something wrong happened maybe.",
      icon: "error"
    });
    }
   
  }
});
  }
  const onIncrease=async()=>{
    setLoading(true)
    const result = await increaseItemDb(_id , quantity);
    if(result.success){
      Swal.fire ("success","quantity increased","success")
      updateQuantity(_id, quantity + 1)
     
    }
    setLoading(false);
  }
  const onDecrease=async()=>{
    setLoading(true)
    const result = await decreaseItemDb(_id , quantity);
     if(result.success){
      Swal.fire ("success","quantity decreased","success")
      updateQuantity(_id, quantity - 1)
    }
   setLoading(false);
  }
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm mb-4">
      {/* Product Image */}
      <div className="w-20 h-20 relative flex -shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-500 mt-1">Price: ৳{price}</p>
      </div>

     {/* Quantity Controls */}
<div className="flex items-center gap-3">
  <button
    onClick={() => onDecrease(item)}
    disabled={quantity === 1 || loading}
    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <AiOutlineMinus size={18} />
  </button>

  <span className="w-8 text-center text-lg font-semibold">
    {quantity}
  </span>

  <button
    onClick={() => onIncrease(item)}
    disabled={quantity === 10 || loading}
    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <AiOutlinePlus size={18} />
  </button>
</div>

      {/* Remove Button */}
      <button
        className="btn btn-sm btn-error ml-4"
        onClick={() => handleDeleteCart(item)}
        title="Remove from cart"
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
};

export default CartItem;