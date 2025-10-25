// postsSlice.js
import { apiSlice } from "./apiSlice";

export const postsSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
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
        { type: 'PostLikes', id: `${postId}-${userId}` },
      ]
    }),
    
    toggleLikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/post-likes/toggle/post/${postId}/user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { postId, userId }) => [
        'Posts',
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

    // COMMENT LIKES ← NUEVO
    toggleCommentLike: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: `/post-comment-likes/${commentId}/like?userId=${userId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: 'CommentLikes', id: commentId },
        { type: 'PostComments', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(commentId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsSlice.util.updateQueryData(
            'getCommentLikeStatus',
            commentId,
            (draft) => {
              draft.hasLiked = !draft.hasLiked;
              draft.likesCount += draft.hasLiked ? 1 : -1;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getCommentLikeStatus: builder.query({
      query: ({ commentId, userId }) => 
        `/post-comment-likes/${commentId}/like/status?userId=${userId}`,
      providesTags: (result, error, { commentId }) => [
        { type: 'CommentLikes', id: commentId }
      ],
    }),

    //obtener los posts likeadeos por userId
    getPostsLikedByUserId: builder.query({
      query: (userId) => `/post-likes/user/${userId}/liked`,
      providesTags: ["Posts"],
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
  useGetCommentsByPostQuery,
  useToggleCommentLikeMutation,
  useGetCommentLikeStatusQuery, 
  useGetPostsLikedByUserIdQuery 
} = postsSlice;