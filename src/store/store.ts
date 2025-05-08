import { create } from 'zustand';

interface ProfileDetails {
  [key: string]: any;
}

interface ServiceSelection {
  gender: string;
  package: string;
}

interface CompanionStore {
  sessionId: string;
  matchingId: string;
  serviceSelected: string;
  profileDetails: ProfileDetails;
  serviceSelection:   ServiceSelection;
  setProfileDetails: (details: Partial<ProfileDetails>) => void;
  setSessionId: (id: string) => void;
  setMatchingId: (id: string) => void;
  setServiceSelected: (service: string) => void;
  reset: () => void;
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
  setMatchingId: (id) => set({ matchingId: id}),
  setServiceSelected: (service) => set({ serviceSelected: service}),
  reset: () =>
    set({
      sessionId: '',
      matchingId: "",
      serviceSelected: "",
      profileDetails: {},
    }),
}));

export default useCompanionStore;