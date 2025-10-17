import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:3000"
  }),  
  tagTypes: ["Users", "User", "Actions", "UserFavorites", "Posts", "PostLikes", "PostComments", "CommentLikes"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"]
    }),
    getUser: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'User', id: userId }
      ]
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
        credentials: 'include' 
      }),
    }),
    loginUser: builder.mutation({
     query: (credentials) => ({
      url: "/users/login",
      method: "POST",
      body: credentials,
      credentials: 'include'
     }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: 'include' 
      }),
    }),
    createCarbon: builder.mutation({
      query: (data) => ({
        url: "/users/carbon",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Users"]
    }),
    setCarbonGoal: builder.mutation({
      query: (data) => ({
        url: "/users/set-carbon-goal",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["User"]
    }),

  }),
});


export const { 
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useCreateCarbonMutation,
  useSetCarbonGoalMutation
} = apiSlice;