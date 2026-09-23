import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
  try {
    const data = localStorage.getItem("wishlist_items");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading wishlist from storage:", error);
    return [];
  }
};

const saveWishlistToStorage = (items) => {
  try {
    localStorage.setItem("wishlist_items", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving wishlist to storage:", error);
  }
};

const initialItems = loadWishlistFromStorage();

const initialState = {
  wishlistItems: initialItems,
  totalWishlist: initialItems.length,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.wishlistItems.find(
        (item) => item.id === newItem.id
      );

      if (!existingItem) {
        state.wishlistItems.push(newItem);
        state.totalWishlist = state.wishlistItems.length;
        saveWishlistToStorage(state.wishlistItems);
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.wishlistItems = state.wishlistItems.filter((item) => item.id !== id);
      state.totalWishlist = state.wishlistItems.length;
      saveWishlistToStorage(state.wishlistItems);
    },
    toggleWishlist: (state, action) => {
      const targetItem = action.payload;
      const index = state.wishlistItems.findIndex(
        (item) => item.id === targetItem.id
      );

      if (index >= 0) {
        state.wishlistItems.splice(index, 1);
      } else {
        state.wishlistItems.push(targetItem);
      }
      state.totalWishlist = state.wishlistItems.length;
      saveWishlistToStorage(state.wishlistItems);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.totalWishlist = 0;
      saveWishlistToStorage([]);
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
