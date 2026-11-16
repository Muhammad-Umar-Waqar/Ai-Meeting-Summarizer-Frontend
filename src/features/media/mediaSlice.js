import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  micOn: true,
  camOn: true,
  captionsOn: false,
  handRaised: false,
  presenting: false,
  speakersOn: true,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    toggleMic(state) {
      state.micOn = !state.micOn;
    },
    toggleCam(state) {
      state.camOn = !state.camOn;
    },
    toggleCaptions(state) {
      state.captionsOn = !state.captionsOn;
    },
    toggleHand(state) {
      state.handRaised = !state.handRaised;
    },
    togglePresent(state) {
      state.presenting = !state.presenting;
    },
    setMic(state, action) {
      state.micOn = action.payload;
    },
    setCam(state, action) {
      state.camOn = action.payload;
    },
    resetMedia() {
      return { ...initialState };
    },
  },
});

export const {
  toggleMic,
  toggleCam,
  toggleCaptions,
  toggleHand,
  togglePresent,
  setMic,
  setCam,
  resetMedia,
} = mediaSlice.actions;

export default mediaSlice.reducer;
