import { apiSlice } from "./apiSlice";

export const followSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    followUser: builder.mutation({
      query: (data) => ({
        url: "/follow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    unfollowUser: builder.mutation({
      query: (data) => ({
        url: "/follow",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    isFollowing: builder.query({
      query: (data) => ({
        url: `/follow/is-following/${data.followerId}/${data.followingId}`,
      }),
      providesTags: ["User"],
    }),    
    getFollowCounts: builder.query({
      query: (userId) => `/follow/counts/${userId}`,
      providesTags: ["User"]
    }),
    getFollowers: builder.query({
      query: ({ userId, page, limit }) => `/follow/followers/${userId}?page=${page}&limit=${limit}`,
      providesTags: ["User"]
    }),
    getFollowing: builder.query({
      query: ({ userId, page, limit }) => `/follow/following/${userId}?page=${page}&limit=${limit}`,
      providesTags: ["User"]
    }),
  }),
});

export const { 
  useFollowUserMutation,
  useUnfollowUserMutation,
  useIsFollowingQuery,
  useGetFollowCountsQuery,
  useGetFollowersQuery,
  useGetFollowingQuery
} = followSlice;

  