// src/features/user/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
    name: string;
    age: number;
    loading: boolean;
}

const initialState: UserState = { name: "", age: 0, loading: false };

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (userId: string) => {
        const response = await fetch(`/api/user/${userId}`);
        return response.json();
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (
            state,
            action: PayloadAction<{ name: string; age: number }>
        ) => {
            state.name = action.payload.name;
            state.age = action.payload.age;
        },
        clearUser: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchUser.fulfilled,
                (state, action: PayloadAction<UserState>) => {
                    state.name = action.payload.name;
                    state.age = action.payload.age;
                    state.loading = false;
                }
            )
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
