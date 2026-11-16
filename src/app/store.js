import { configureStore } from '@reduxjs/toolkit';
import meetingReducer from '../features/meeting/meetingSlice';
import mediaReducer from '../features/media/mediaSlice';
import participantsReducer from '../features/participants/participantsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    meeting: meetingReducer,
    media: mediaReducer,
    participants: participantsReducer,
    ui: uiReducer,
  },
});
