import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const actionsSlice = createApi({
  reducerPath: "actions",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://actions-api-production.up.railway.app"
  }),
  endpoints: (builder) => ({
    getActions: builder.query({
      query: () => "/actions",
      providesTags: ["Actions"]
    }),
    createAction: builder.mutation({
      query: (newAction) => ({
        url: "/actions",
        method: "POST",
        body: newAction,
      }),
      invalidatesTags: ["Actions"]
    }),
  }),
});

export const { useGetActionsQuery, useCreateActionMutation } = actionsSlice;