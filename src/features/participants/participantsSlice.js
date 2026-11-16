import { createSlice } from '@reduxjs/toolkit';

const MOCK_PARTICIPANTS = [
  {
    id: 'p1',
    name: 'Alex Rivera',
    initials: 'AR',
    color: '#1a73e8',
    micOn: true,
    camOn: false,
    isSelf: false,
    handRaised: false,
  },
  {
    id: 'p2',
    name: 'Jordan Lee',
    initials: 'JL',
    color: '#188038',
    micOn: false,
    camOn: true,
    isSelf: false,
    handRaised: false,
  },
  {
    id: 'p3',
    name: 'Sam Patel',
    initials: 'SP',
    color: '#e37400',
    micOn: true,
    camOn: false,
    isSelf: false,
    handRaised: true,
  },
  {
    id: 'p4',
    name: 'Casey Kim',
    initials: 'CK',
    color: '#a142f4',
    micOn: true,
    camOn: true,
    isSelf: false,
    handRaised: false,
  },
];

const initialState = {
  list: [],
};

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    loadMockParticipants(state, action) {
      const selfName = action.payload?.displayName || 'You';
      const self = {
        id: 'self',
        name: selfName,
        initials: selfName
          .split(' ')
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'Y',
        color: '#1a73e8',
        micOn: action.payload?.micOn ?? true,
        camOn: action.payload?.camOn ?? true,
        isSelf: true,
        handRaised: false,
      };
      state.list = [self, ...MOCK_PARTICIPANTS];
    },
    syncSelfMedia(state, action) {
      const self = state.list.find((p) => p.isSelf);
      if (!self) return;
      if (typeof action.payload.micOn === 'boolean') {
        self.micOn = action.payload.micOn;
      }
      if (typeof action.payload.camOn === 'boolean') {
        self.camOn = action.payload.camOn;
      }
      if (typeof action.payload.handRaised === 'boolean') {
        self.handRaised = action.payload.handRaised;
      }
    },
    clearParticipants() {
      return { ...initialState };
    },
  },
});

export const {
  loadMockParticipants,
  syncSelfMedia,
  clearParticipants,
} = participantsSlice.actions;

export default participantsSlice.reducer;
