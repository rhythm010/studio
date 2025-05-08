import { create } from 'zustand';

interface ProfileDetails {
  [key: string]: any;
}

interface CompanionStore {
  sessionId: string;
  matchingId: string;
  serviceSelected: string;
  profileDetails: ProfileDetails;  
  setProfileDetails: (details: Partial<ProfileDetails>) => void;
  setSessionId: (id: string) => void;
  setMatchingId: (id: string) => void;
  setServiceSelected: (service: string) => void;
  reset: () => void;
}

const useCompanionStore = create<CompanionStore>((set) => ({
  sessionId: '',
  matchingId: '',
  serviceSelected: '',
  profileDetails: {},
  setProfileDetails: (details) =>
    set((state) => ({
      profileDetails: { ...state.profileDetails, ...details },
    })),
  setSessionId: (id) => set({ sessionId: id }),
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