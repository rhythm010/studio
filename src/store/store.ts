import { ACTIVITY_MODES } from '@/lib/constants';
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

interface ClientCompanionDetails {
  primaryCompanionSessionId: string | null;
  secondaryCompanionSessionId: string | null;
}

interface CompanionProfileDetails {
  primaryCompanionName: string | null;
  secondaryCompanionName: string | null;
  clientSessionId: string | null;
  companionRole: string;
}

interface CompanionQueueManage {
  queueActivated: boolean;
  currentPosition: number;
}

interface CompanionRestaurantManage {
  isActive: boolean;
  clientMsg: {
    msg_id: number;
    itemName: string;
    quantity: number;
    comments: string;
  }[];
}

interface ClientActivityMonitor {
  modeTitle: string;
  currentMode: string;
  currentStatus: string;
  statusInfo: {
    QUEUE: {
      active: boolean;
      currentPosition: number;
      approxTime: number;
      actionButtons: {
        addItem: string;
      };
    };
    PAYMENT_CALL: { 
      active: boolean;
      time: string;
      actionButtons: {
        addItem: string;
      };
    };
    WAIT_ITEM: {
      active: boolean;
      time: string;
      actionButtons: {
        addItem: string;
      };
    };
    WAIT_OP: {
      active: boolean;
      actionButtons: {
        addItem: string;
      };
    };
    WITH_YOU: {
      active: boolean;
      actionButtons: {
        addItem: string;
      };
    }
  };
  companionFlow: {
    selectedMode: string;
  };
}


interface CompanionStore {
  isDevMode: boolean;
  sessionId: string;
  setIsDevMode: (isDev: boolean) => void; // Setter for isDevMode
  getIsDevMode: () => boolean; // Getter for isDevMode
  matchingId: string;
  serviceSelected: string;
  profileDetails: ProfileDetails;
  serviceSelection: ServiceSelection;
  feedbackDetails: FeedbackDetails[];
  companionFeedbackDetails: FeedbackDetails[];
  isComplete: boolean; // Add isComplete key
  serviceRunning: boolean;
  companionProfileDetails: CompanionProfileDetails;
  clientCompanionDetails: ClientCompanionDetails;
  companionRestaurantManage: CompanionRestaurantManage; // Add the new property
  companionQueueManage: CompanionQueueManage; // Add the new property
  ClientActivityMonitor: ClientActivityMonitor; // Add the new property
  setProfileDetails: (details: Partial<ProfileDetails>) => void;
  setMatchingDone: (done: boolean) => void;
  setSessionId: (id: string) => void;
  getSessionId: () => string;
  setDevSession: (isDev: boolean) => void;
  setMatchingId: (id: string) => void;
  setClientSessionId: (id: string | null) => void;
  getClientSessionId: () => string | null;
  setServiceSelected: (service: string) => void;
  reset: () => void;
  addFeedback: (feedback: FeedbackDetails) => void;
  setServiceSelection: (selection: ServiceSelection) => void;
  getMatchingDone: () => boolean;
  setIsComplete: (complete: boolean) => void; // Add setIsComplete setter
  setCompanionFeedbackDetails: (feedback: FeedbackDetails[]) => void;
  getCompanionFeedbackDetails: () => FeedbackDetails[];
  getIsComplete: () => boolean; // Add getIsComplete getter
  setServiceRunning: (running: boolean) => void;
  getServiceRunning: () => boolean;
  setCompanionProfileDetails: (details: Partial<CompanionProfileDetails>) => void;
  getCompanionProfileDetails: () => CompanionProfileDetails;
  setClientCompanionDetails: (details: Partial<ClientCompanionDetails>) => void;
  getClientCompanionDetails: () => ClientCompanionDetails;
  setCompanionRole: (role: string) => void;
  getCompanionRole: () => string;
  setCompanionQueueManage: (details: Partial<CompanionQueueManage>) => void; // Add setter
  getCompanionQueueManage: () => CompanionQueueManage; // Add getter
  setCompanionRestaurantManage: (details: Partial<CompanionRestaurantManage>) => void; // Add setter
  getCompanionRestaurantManage: () => CompanionRestaurantManage; // Add getter
  setQueueActivated: (activated: boolean) => void; // Add setter for queueActivated
  setCurrentPosition: (position: number) => void; // Add setter for currentPosition
  setClientActivityMonitor: (details: Partial<ClientActivityMonitor>) => void; // Add setter
  getClientActivityMonitor: () => ClientActivityMonitor; // Add getter
}

const useCompanionStore = create<CompanionStore>((set) => ({
  isDevMode: true,
  setIsDevMode: (isDev) => set({ isDevMode: isDev }), // Implement setter
  getIsDevMode: () => useCompanionStore.getState().isDevMode, // Implement getter
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
  feedbackDetails: [],
  companionFeedbackDetails: [],
  isComplete: false, // Initialize isComplete to false
  serviceRunning: true,
  companionQueueManage: { // Initialize the new property
    queueActivated: false,
    currentPosition: 0,
  },
  companionRestaurantManage: { // Initialize the new property
    isActive: false,
    clientMsg: [{
      msg_id: 1,
      itemName: 'juice',
      quantity: 2,
      comments: 'make it spicy',
    }],
  },
  ClientActivityMonitor: { // Initialize the new property
    modeTitle: "WITH_YOU",
    currentStatus: "WITH_YOU",
    currentMode: 'WITH_YOU',
    statusInfo: {
      QUEUE: {
        currentPosition: 2,
        active: false,
        approxTime: 0,
        actionButtons: {
          addItem: "",
        },
      },
      PAYMENT_CALL: {
        active: false,
        time: "",
        actionButtons: {
          addItem: "",
        },
      },
      WAIT_ITEM: {
        active: false,
        time: "",
        actionButtons: { addItem: "" },
      },
      WAIT_OP: { 
        active: false,
        actionButtons: { addItem: "" } },
      WITH_YOU: {
        active: false,
        actionButtons: { addItem: "" }}
    },
    companionFlow: {
      selectedMode: "WITH_YOU"
    },
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
  setClientSessionId: (id) => set(state => ({ companionProfileDetails: { ...state.companionProfileDetails, clientSessionId: id } })),
  getClientSessionId: () => useCompanionStore.getState().companionProfileDetails.clientSessionId,
  setMatchingId: (id) => set({ matchingId: id }),
  setServiceSelected: (service) => set({ serviceSelected: service }),
  addFeedback: (feedback) =>
    set((state) => ({
      feedbackDetails: [...state.feedbackDetails, { ...feedback, details: feedback.details || '' }],
    })),

  setCompanionFeedbackDetails: (feedback) => set({ companionFeedbackDetails: feedback }),
  getCompanionFeedbackDetails: () => useCompanionStore.getState().companionFeedbackDetails,
  getMatchingDone: () => useCompanionStore.getState().matchingDone,
  setIsComplete: (complete) => set({ isComplete: complete }), // Implement setIsComplete
  setServiceRunning: (running) => set({ serviceRunning: running }),
  getServiceRunning: () => useCompanionStore.getState().serviceRunning,
  getIsComplete: () => useCompanionStore.getState().isComplete, // Implement getIsComplete

  clientCompanionDetails: { primaryCompanionSessionId: '', secondaryCompanionSessionId: '' },
  companionProfileDetails: { primaryCompanionName: null, secondaryCompanionName: null, clientSessionId: null, companionRole: '' },
  setCompanionProfileDetails: (details) =>
    set((state) => ({
      companionProfileDetails: { ...state.companionProfileDetails, ...details },

    })),
  getCompanionProfileDetails: () =>
    useCompanionStore.getState().companionProfileDetails,
  setClientCompanionDetails: (details) =>
    set((state) => ({
      clientCompanionDetails: { ...state.clientCompanionDetails, ...details },
    })),
  getClientCompanionDetails: () => useCompanionStore.getState().clientCompanionDetails,
  setCompanionRole: (role) => set(state => ({ companionProfileDetails: { ...state.companionProfileDetails, companionRole: role } })),
  getCompanionRole: () => useCompanionStore.getState().companionProfileDetails.companionRole,

  // Implement the new getters and setters
  setCompanionQueueManage: (details) =>
    set((state) => ({
      companionQueueManage: { ...state.companionQueueManage, ...details },
    })),
  getCompanionQueueManage: () => useCompanionStore.getState().companionQueueManage,
  setQueueActivated: (activated) => set(state => ({ companionQueueManage: { ...state.companionQueueManage, queueActivated: activated } })),

  // Implement the new getters and setters for companionRestaurantManage
  setCompanionRestaurantManage: (details) =>
    set((state) => ({
      companionRestaurantManage: { ...state.companionRestaurantManage, ...details },
    })),
  getCompanionRestaurantManage: () => useCompanionStore.getState().companionRestaurantManage,

  setCurrentPosition: (position) => set(state => ({ companionQueueManage: { ...state.companionQueueManage, currentPosition: position } })),

  setClientActivityMonitor: (details) =>
    set((state) => ({
      ClientActivityMonitor: { ...state.ClientActivityMonitor, ...details },
    })),

  getClientActivityMonitor: () => useCompanionStore.getState().ClientActivityMonitor,

  reset: () =>
    set({
      isComplete: false, // Reset isComplete on reset as well
      sessionId: '',
      serviceRunning: true,
      matchingId: "",
      serviceSelected: "",
      profileDetails: {},
    }),
}));

export { useCompanionStore };

// TODO: In the component for the end-service route,
// call the 'endServiceInDb' method from utils
// when the session is considered ended.