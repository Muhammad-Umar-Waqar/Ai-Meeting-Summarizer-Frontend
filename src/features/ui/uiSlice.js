import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidePanel: null, // 'people' | 'chat' | 'activities' | null
  moreMenuOpen: false,
  newMeetingMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidePanel(state, action) {
      state.sidePanel =
        state.sidePanel === action.payload ? null : action.payload;
    },
    closeSidePanel(state) {
      state.sidePanel = null;
    },
    toggleMoreMenu(state) {
      state.moreMenuOpen = !state.moreMenuOpen;
    },
    closeMoreMenu(state) {
      state.moreMenuOpen = false;
    },
    toggleNewMeetingMenu(state) {
      state.newMeetingMenuOpen = !state.newMeetingMenuOpen;
    },
    closeNewMeetingMenu(state) {
      state.newMeetingMenuOpen = false;
    },
    resetUi() {
      return { ...initialState };
    },
  },
});

export const {
  openSidePanel,
  closeSidePanel,
  toggleMoreMenu,
  closeMoreMenu,
  toggleNewMeetingMenu,
  closeNewMeetingMenu,
  resetUi,
} = uiSlice.actions;

export default uiSlice.reducer;
