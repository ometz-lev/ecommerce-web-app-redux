//This file is used to configure the Redux store for the application.
//It imports the cartReducer from the cartSlice and sets it up as a 
//reducer in the store configuration. The store is then exported for use
//in the application, along with types for RootState and AppDispatch to facilitate type safety when using Redux in TypeScript.


import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
