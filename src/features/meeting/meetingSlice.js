import { createSlice } from '@reduxjs/toolkit';

function generateMeetingCode() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const part = () =>
    Array.from({ length: 3 }, () =>
      alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join('');
  return `${part()}-${part()}-${part()}`;
}

const initialState = {
  code: '',
  title: 'Instant meeting',
  displayName: 'You',
  joined: false,
  startedAt: null,
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetingCode(state, action) {
      state.code = action.payload.trim().toLowerCase();
    },
    setDisplayName(state, action) {
      state.displayName = action.payload.trim() || 'You';
    },
    setMeetingTitle(state, action) {
      state.title = action.payload;
    },
    createMeeting(state) {
      state.code = generateMeetingCode();
      state.title = 'Instant meeting';
      state.joined = false;
      state.startedAt = null;
    },
    joinMeeting(state) {
      state.joined = true;
      state.startedAt = Date.now();
      if (!state.title) state.title = 'Meeting';
    },
    leaveMeeting() {
      return { ...initialState };
    },
  },
});

export const {
  setMeetingCode,
  setDisplayName,
  setMeetingTitle,
  createMeeting,
  joinMeeting,
  leaveMeeting,
} = meetingSlice.actions;

export default meetingSlice.reducer;
