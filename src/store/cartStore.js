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

      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) =>
            item.productId === product.productId && item.size === product.size
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.productId === product.productId && item.size === product.size
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

      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item.productId === productId && item.size === size)
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // =========================
      // WISHLIST
      // =========================
      wishlist: [],

      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        const pId = String(product._id || product.id || product.productId);
        const exists = wishlist.some(
          (item) => String(item._id || item.id || item.productId) === pId
        );

        if (!exists) {
          set({ wishlist: [...wishlist, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter(
            (item) =>
              String(item._id || item.id || item.productId) !== String(productId)
          ),
        }));
      },

      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const pId = String(product._id || product.id || product.productId);
        const exists = wishlist.some(
          (item) => String(item._id || item.id || item.productId) === pId
        );

        if (exists) {
          set({
            wishlist: wishlist.filter(
              (item) =>
                String(item._id || item.id || item.productId) !== pId
            ),
          });
        } else {
          set({ wishlist: [...wishlist, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some(
          (item) =>
            String(item._id || item.id || item.productId) === String(productId)
        );
      },
    }),
    {
      name: "clover-clothing-cart",
    }
  )
);

export default useCartStore;