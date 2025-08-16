import { configureStore } from '@reduxjs/toolkit';
import diagramReducer from './diagramSlice';

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
