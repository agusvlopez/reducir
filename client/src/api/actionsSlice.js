import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const actionsSlice = createApi({
  reducerPath: "actions",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://actions-api-production.up.railway.app"
    // baseUrl: "http://localhost:3000"
  }),
  tagTypes: ['Actions', 'UserFavorites'],
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
    toggleFavoriteAction: builder.mutation({
      query: (ids) => ({
        url: "http://localhost:3000/users/toggle-favorite-action",
        method: "PATCH",
        body: ids
      }),
      invalidatesTags: ['Actions', 'UserFavorites']
    }),
    checkFavoriteAction: builder.query({
      query: ({ userId, actionId }) => 
        `http://localhost:3000/users/${userId}/favorite-actions/${actionId}`,
      providesTags: (result, error, { actionId }) => [
        { type: 'UserFavorites', id: actionId },
        'Actions'
      ]
    }),
    getFavoriteActions: builder.query({
      query: (userId) => `http://localhost:3000/users/${userId}/favorite-actions`,
      providesTags: (result, error, userId) => [
        { type: 'UserFavorites', id: userId },
      ]
    }),
  }),
});

export const { 
  useGetActionsQuery, 
  useCreateActionMutation, 
  useToggleFavoriteActionMutation, 
  useCheckFavoriteActionQuery,
  useGetFavoriteActionsQuery
} = actionsSlice;