import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asynsAction";

// export * from './app'


export const productsSlice = createSlice({
    name: 'product',
    initialState: {
        newProducts: null,
        errorMessage: '',

    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(actions.getNewProducts.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newProducts = action.payload;
        })
        builder.addCase(actions.getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        })
    }
})
export default productsSlice.reducer;