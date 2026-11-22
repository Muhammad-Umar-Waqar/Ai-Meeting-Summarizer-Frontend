import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import meetingReducer from '../features/meeting/meetingSlice';
import mediaReducer from '../features/media/mediaSlice';
import participantsReducer from '../features/participants/participantsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meeting: meetingReducer,
    media: mediaReducer,
    participants: participantsReducer,
    ui: uiReducer,
  },
});
