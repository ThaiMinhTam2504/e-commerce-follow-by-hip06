// import { configureStore } from '@reduxjs/toolkit';
// import appSlice from './app/appSlice';
// import { productsSlice } from './products/productSlice';

// export const store = configureStore({
//   reducer: {
//     app: appSlice,
//     products: productsSlice,
//   },
// });



import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import appSlice from './app/appSlice';
import productsReducer from './products/productSlice';
import appReducer from './app/appSlice';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer, persistStore, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import userReducer from './user/userSlice';



const commonConfig = {

  storage
}
const userConfig = {
  ...commonConfig,
  key: 'shop/user',
  whitelist: ['isLoggedIn', 'token', 'current', 'currentCart'] //lưu vào localStorage để tránh khi refresh lại bị mất thì do đó dẫn đến xử lý login phân quyền bị lỗi (all public, member,admin)
}

const productConfig = {
  ...commonConfig,
  key: 'shop/deal',
  whitelist: ['dealDaily'] //lưu vào localStorage để tránh khi refresh lại bị mất thì do đó dẫn đến xử lý login phân quyền bị lỗi (all public, member,admin)
}

const store = configureStore({
  reducer: {
    app: appReducer,
    // products: productsReducer,
    products: persistReducer(productConfig, productsReducer),
    user: persistReducer(userConfig, userReducer)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }
    })
});

const persistor = persistStore(store);

export { store, persistor }