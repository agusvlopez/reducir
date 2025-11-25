import { apiSlice } from "./apiSlice";

export const actionsSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getActions: builder.query({
      query: () => "https://actions-api-0fyh.onrender.com/actions",
      providesTags: ["Actions"]
    }),
    // createAction: builder.mutation({
    //   query: (newAction) => ({
    //     url: "https://actions-api-0fyh.onrender.com/actions",
    //     method: "POST",
    //     body: newAction,
    //   }),
    //   invalidatesTags: ["Actions"]
    // }),
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
    updateActionProgress: builder.mutation({
      query: ({ userId, actionId, progress }) => ({
        url: `http://localhost:3000/users/${userId}/achieved-actions/${actionId}/progress`,
        method: 'PATCH',
        body: { progress },
      }),
      // Invalidar caché para que se actualice el usuario
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'AchievedActions'
      ],
    }),
    //este estoy usando:
    addActionToAchieved: builder.mutation({
      query: (data) => ({
        url: "http://localhost:3000/users/add-action-to-achieved",
        method: "PATCH",
        body: data
      }),
    }),
    checkActionProgress: builder.query({
      query: ({ userId, actionId }) => 
        `http://localhost:3000/users/check-action-progress/${userId}/${actionId}`,
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
  // useCreateActionMutation, 
  useToggleSavedActionMutation, 
  useCheckSavedActionQuery,
  useGetSavedActionsQuery,
  useAddActionToAchievedMutation,
  useCheckActionProgressQuery,
  useUpdateActionProgressMutation,
  useAddAchievedActionMutation,
  useCheckAchievedActionQuery,
  useGetAchievedActionsQuery,
  useCheckCarbonQuery
} = actionsSlice;