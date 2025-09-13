import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.js";
import { actionsSlice } from "../api/actionsSlice.js";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [actionsSlice.reducerPath]: actionsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
          .concat(apiSlice.middleware)
          .concat(actionsSlice.middleware),
});

