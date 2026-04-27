import { createSlice } from "@reduxjs/toolkit";


const initialState = ({
    currentUser: null,
    loading: false,
    error: null
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutUserStart: (state) => {
            state.loading = false;
            state.error = null
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false
        }

    }
});
export const { signInFailure, signInStart, signInSuccess, signOutUserFailure,
     signOutUserStart, signOutUserSuccess, deleteUserFailure,
    deleteUserStart, deleteUserSuccess, updateUserStart, updateUserFailure, updateUserSuccess
} = userSlice.actions;

export default userSlice.reducer;