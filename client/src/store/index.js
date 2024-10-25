import { configureStore } from '@reduxjs/toolkit';
import account from './accountSlice.js';

const store = configureStore({
  reducer: {
    account,
  },
});

export default store;
