import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:3000"
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"]
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
        credentials: 'include' // Necessary if the backend uses cookies for authentication
      }),
      // invalidatesTags: ["Users"]
    }),
    loginUser: builder.mutation({
     query: (credentials) => ({
      url: "/users/login",
      method: "POST",
      body: credentials,
      credentials: 'include' // Necessary if the backend uses cookies for authentication
     }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: 'include' // Necessary if the backend uses cookies for authentication
      }),
    }),
    createCarbon: builder.mutation({
      query: (data) => ({
        url: "/users/carbon",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Users"]
    })
  }),
});


export const { 
  useGetUsersQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCreateCarbonMutation
} = apiSlice;