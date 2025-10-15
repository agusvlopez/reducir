import { apiSlice } from "./apiSlice";

export const actionsSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
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
    toggleSavedAction: builder.mutation({
      query: (ids) => ({
        url: "http://localhost:3000/users/toggle-favorite-action",
        method: "PATCH",
        body: ids
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }, 
        'UserFavorites'
      ]
    }),
    checkSavedAction: builder.query({
      query: ({ userId, actionId }) => 
        `http://localhost:3000/users/${userId}/favorite-actions/${actionId}`,
      providesTags: (result, error, { actionId }) => [
        { type: 'UserFavorites', id: actionId },
        'Actions'
      ]
    }),
    getSavedActions: builder.query({
      query: (userId) => `http://localhost:3000/users/${userId}/favorite-actions`,
      providesTags: (result, error, userId) => [
        { type: 'UserFavorites', id: userId },
        { type: 'User', id: userId }
      ]
    }),
    addAchievedAction: builder.mutation({
      query: (data) => ({
        url: "http://localhost:3000/users/add-achieved-action",
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (result, error, { userId, actionId }) => [
        { type: 'User', id: userId },
        { type: 'AchievedAction', id: `${userId}-${actionId}` }
      ]
    }),
    checkAchievedAction: builder.query({
      query: ({ userId, actionId }) => 
        `http://localhost:3000/users/${userId}/achieved-actions/${actionId}`,
      providesTags: (result, error, { userId, actionId }) => [
        { type: 'UserFavorites', id: actionId },
        { type: 'User', id: userId },
        'Actions'
      ]
    }),
    getAchievedActions: builder.query({
      query: (userId) => `http://localhost:3000/users/${userId}/achieved-actions`,
      providesTags: (result, error, userId) => [
        { type: 'UserFavorites', id: `achieved-${userId}` },
        { type: 'User', id: userId }
      ]
    }),
    checkCarbon: builder.query({
      query: ({ userId }) => `http://localhost:3000/users/${userId}/carbon`,
      providesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }
      ]
    })
  }),
})

export const { 
  useGetActionsQuery, 
  useCreateActionMutation, 
  useToggleSavedActionMutation, 
  useCheckSavedActionQuery,
  useGetSavedActionsQuery,
  useAddAchievedActionMutation,
  useCheckAchievedActionQuery,
  useGetAchievedActionsQuery,
  useCheckCarbonQuery
} = actionsSlice;