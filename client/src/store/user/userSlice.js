import { createSlice, current } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
        currentCart: []
    },
    reducers: {
        login: (state, action) => {
            // console.log(action.payload)
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.current = null;
            state.mes = '';
        },
        clearMessage: (state) => {
            state.mes = ''
        },
        updateCart: (state, action) => {
            const { pid, quantity, color } = action.payload;
            const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
            // console.log(updateCart)
            const updatedCart = updatingCart.map(el => {
                if (el.color === color && el.product?._id === pid) {
                    return { ...el, quantity }
                } else return el
            })
            state.currentCart = updatedCart.filter(el => el.quantity > 0)

        }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;  //cái action.payload này là cái response.rs ở asyncAction.js
            state.isLoggedIn = true;
            state.currentCart = action.payload.cart
        })
        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.mes = 'Your session has expired. Please login again.'
        })
    }
})
export const { login, logout, clearMessage, updateCart } = userSlice.actions;
export default userSlice.reducer;