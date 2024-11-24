import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../features/loginSlice';
import messageReducer from '../features/messageSlice';
import userlistReducer from '../features/userlistSlice';
import roomlistReducer from '../features/roomlistSlice';


export const store = configureStore({
  reducer: {
    login : loginReducer,
    message : messageReducer,
    userlist:userlistReducer,
    roomlist:roomlistReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
