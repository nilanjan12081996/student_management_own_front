import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import quizzesReducer from './slices/quizzesSlice';
// Future slices can be added here
// import notesReducer from './slices/notesSlice';
// import batchesReducer from './slices/batchesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    quizzes: quizzesReducer,
  },
});
