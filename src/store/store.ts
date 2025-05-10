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
}

interface CompanionStore {
  sessionId: string;
  matchingId: string;
  serviceSelected: string;
  profileDetails: ProfileDetails;
  serviceSelection:   ServiceSelection;
  feedbackDetails: FeedbackDetails[];
  setProfileDetails: (details: Partial<ProfileDetails>) => void;
  setSessionId: (id: string) => void;
  setMatchingId: (id: string) => void;
  setServiceSelected: (service: string) => void;
  reset: () => void;
  addFeedback: (feedback: FeedbackDetails) => void;
  setServiceSelection: (selection: ServiceSelection) => void;
}

const useCompanionStore = create<CompanionStore>((set) => ({
  sessionId: '',
  matchingId: '',
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
  setServiceSelection: (selection) => set({ serviceSelection: selection }),
  feedbackDetails: [],
  setMatchingId: (id) => set({ matchingId: id}),
  setServiceSelected: (service) => set({ serviceSelected: service}),
  addFeedback: (feedback) =>
    set((state) => ({ feedbackDetails: [...state.feedbackDetails, feedback] })),
  reset: () =>
    set({
      sessionId: '',
      matchingId: "",
      serviceSelected: "",
      profileDetails: {},
    }),
}));

export { useCompanionStore };