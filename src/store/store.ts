import { create } from 'zustand';

interface ProfileDetails {
  [key: string]: any;
}

interface ServiceSelection {
  gender: string;
  package: string;
}

interface FeedbackDetails {
  question: string;
  response: string | boolean;
  details: string;
}

interface CompanionStore {
  sessionId: string;
  matchingId: string;
  serviceSelected: string;
  profileDetails: ProfileDetails;
  serviceSelection:   ServiceSelection;
  feedbackDetails: FeedbackDetails[];
  setProfileDetails: (details: Partial<ProfileDetails>) => void;
  setMatchingDone: (done: boolean) => void;
  setSessionId: (id: string) => void;
  getSessionId: () => string;
  setDevSession: (isDev: boolean) => void;
  setMatchingId: (id: string) => void;
  setServiceSelected: (service: string) => void;
  reset: () => void;
  addFeedback: (feedback: FeedbackDetails) => void;
  setServiceSelection: (selection: ServiceSelection) => void;
  getMatchingDone: () => boolean;
}

const useCompanionStore = create<CompanionStore>((set) => ({
  sessionId: '',
  matchingId: '',
  dev_session: false, // Add the dev_session key with initial value
  matchingDone: false,
  serviceSelected: '',
  profileDetails: {},
  serviceSelection: {
    gender: '',
    package: '',

  },
  setProfileDetails: (details) =>
    set((state) => ({
      profileDetails: { ...state.profileDetails, ...details },
    })),
  setSessionId: (id) => set({ sessionId: id }),
  setDevSession: (isDev) => set({ dev_session: isDev }), // Add the setDevSession method
  setMatchingDone: (done) => set({ matchingDone: done }),
  getSessionId: () => useCompanionStore.getState().sessionId, // Add the getSessionId method
  setServiceSelection: (selection) => set({ serviceSelection: selection }),
  feedbackDetails: [],
  setMatchingId: (id) => set({ matchingId: id}),
  setServiceSelected: (service) => set({ serviceSelected: service}),
  addFeedback: (feedback) =>
 set((state) => ({
 feedbackDetails: [...state.feedbackDetails, { ...feedback, details: feedback.details || '' }],
 })),
  getMatchingDone: () => useCompanionStore.getState().matchingDone,
  reset: () =>
    set({
      sessionId: '',
      matchingId: "",
      serviceSelected: "",
      profileDetails: {},
    }),
}));

export { useCompanionStore };