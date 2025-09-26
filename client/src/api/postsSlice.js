import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// En tu postsSlice
export const postsSlice = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
  }),
  tagTypes: ['Posts', 'PostLikes'], // Define los tipos
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Posts"]
    }),
    
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ['Posts'], // Solo Posts, no PostLikes
    }),
    
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
        { type: 'PostLikes', id: postId } // Tag específico por post
      ]
    }),
    
    existsLikePost: builder.query({
      query: ({ postId, userId }) => 
        `/post-likes/exists/post/${postId}/user/${userId}`,
      providesTags: (result, error, { postId, userId }) => [
        { type: 'PostLikes', id: `${postId}-${userId}` } // Tag específico
      ]
    }),
    
    toggleLikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/post-likes/toggle/post/${postId}/user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { postId, userId }) => [
        'Posts', // Invalida todos los posts (para likesCount)
        { type: 'PostLikes', id: `${postId}-${userId}` }, // Like específico
        { type: 'PostLikes', id: postId } // Todos los likes del post
      ]
    }),
  }),
});

export const { useGetPostsQuery, useGetPostQuery, useCreatePostMutation, useToggleLikePostMutation, useExistsLikePostQuery } = postsSlice;