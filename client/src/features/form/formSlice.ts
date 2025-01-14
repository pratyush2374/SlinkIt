import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Form {
    submitting: boolean;
    data: {
        longUrl: string;
        alias: string;
    };
}

const initialState: Form = {
    submitting: false,
    data: { longUrl: "", alias: "" },
};

const counterSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.submitting = action.payload;
        },

        setData: (
            state,
            action: PayloadAction<{ longUrl: string; alias: string }>
        ) => {
            state.data.longUrl = action.payload.longUrl;
            state.data.alias = action.payload.alias;
        },
    },
});

export const { setSubmitting, setData} = counterSlice.actions;
export default counterSlice.reducer;
