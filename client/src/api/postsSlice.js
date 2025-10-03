// postsSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsSlice = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
  }),
  tagTypes: ['Posts', 'PostLikes', 'PostComments'], // Agrega PostComments
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
      providesTags: ['Posts'],
    }),
    
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [
        { type: 'Posts', id: postId },
        { type: 'PostLikes', id: postId },
        { type: 'PostComments', id: postId } // Agrega tag de comentarios
      ]
    }),
    
    getPostsByUser: builder.query({
      query: (userId) => `/posts/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'Posts', id: userId },
      ]
    }),
    
    existsLikePost: builder.query({
      query: ({ postId, userId }) => 
        `/post-likes/exists/post/${postId}/user/${userId}`,
      providesTags: (result, error, { postId, userId }) => [
        { type: 'PostLikes', id: `${postId}-${userId}` }
      ]
    }),
    
    toggleLikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/post-likes/toggle/post/${postId}/user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { postId, userId }) => [
        'Posts', // Invalida todos los posts (para likesCount)
        { type: 'PostLikes', id: `${postId}-${userId}` },
        { type: 'PostLikes', id: postId }
      ]
    }),
    
    // ENDPOINTS DE COMENTARIOS
    getPostComments: builder.query({
      query: (postId) => `/post-comments/post/${postId}`,
      providesTags: (result, error, postId) => [
        { type: 'PostComments', id: postId }
      ]
    }),
    
    createPostComment: builder.mutation({
      query: (newComment) => ({
        url: "/post-comments",
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: (result, error, { postId }) => [
        'Posts', // Invalida todos los posts (para commentsCount)
        { type: 'Posts', id: postId }, // Post específico
        { type: 'PostComments', id: postId } // Comentarios del post
      ]
    }),

    getCommentsByPost: builder.query({
      query: (postId) => `/post-comments/post/${postId}`,
      providesTags: (result, error, postId) => [
        { type: 'PostComments', id: postId }
      ]
    }),
  }),
});

export const { 
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostsByUserQuery,
  useExistsLikePostQuery,
  useToggleLikePostMutation,
  useGetPostCommentsQuery,
  useCreatePostCommentMutation,
  useGetCommentsByPostQuery
} = postsSlice;

export default postsSlice;