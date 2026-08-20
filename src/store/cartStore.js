"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // =========================
      // CART
      // =========================

      cart: [],

      // =========================
      // ADD TO CART
      // =========================

      addToCart: (product) => {
        const cart = get().cart;

        const existingItem = cart.find(
          (item) =>
            item.productId === product.productId &&
            item.size === product.size
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.productId === product.productId &&
              item.size === product.size
                ? {
                    ...item,
                    quantity: item.quantity + (product.quantity || 1),
                  }
                : item
            ),
          });

          return;
        }

        set({
          cart: [
            ...cart,
            {
              productId: product.productId,
              name: product.name,
              image: product.image,
              price: Number(product.price || 0),
              size: product.size,
              quantity: product.quantity || 1,
            },
          ],
        });
      },

      // =========================
      // INCREASE QUANTITY
      // =========================

      increaseQuantity: (productId, size) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId && item.size === size
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, 10),
                }
              : item
          ),
        }));
      },

      // =========================
      // DECREASE QUANTITY
      // =========================

    decreaseQuantity: (productId, size) => {
  set((state) => ({
    cart: state.cart.map((item) =>
      item.productId === productId && item.size === size
        ? {
            ...item,
            quantity: Math.max(item.quantity - 1, 1),
          }
        : item
    ),
  }));
},

      // =========================
      // REMOVE ITEM
      // =========================

      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.size === size
              )
          ),
        }));
      },

      // =========================
      // CLEAR CART
      // =========================

      clearCart: () => {
        set({
          cart: [],
        });
      },

      // =========================
      // TOTAL ITEMS
      // =========================

      getTotalItems: () => {
        return get().cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      // =========================
// WISHLIST
// =========================

wishlist: [],

// =========================
// ADD / REMOVE WISHLIST
// =========================

toggleWishlist: (product) => {
  const wishlist = get().wishlist;

  const exists = wishlist.some(
    (item) => String(item._id) === String(product._id)
  );

  if (exists) {
    set({
      wishlist: wishlist.filter(
        (item) => String(item._id) !== String(product._id)
      ),
    });
  } else {
    set({
      wishlist: [...wishlist, product],
    });
  }
},

// =========================
// CHECK WISHLIST
// =========================

isInWishlist: (productId) => {
  return get().wishlist.some(
    (item) => String(item._id) === String(productId)
  );
},

// =========================
// REMOVE FROM WISHLIST
// =========================

removeFromWishlist: (productId) => {
  set({
    wishlist: get().wishlist.filter(
      (item) => String(item._id) !== String(productId)
    ),
  });
},

      // =========================
      // TOTAL PRICE
      // =========================

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0
        );
      },
    }),


    

    {
      name: "clover-clothing-cart",
    }
  )
);

export default useCartStore;