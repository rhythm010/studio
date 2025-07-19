import { ACTIVITY_STATUS, ACTIVITY_MODES } from '@/lib/constants';
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
 getPrimaryCompanionSessionId: () => string | null; // Getter for primaryCompanionSessionId
 getSecondaryCompanionSessionId: () => string | null; // Getter for secondaryCompanionSessionId
}

interface CompanionProfileDetails {
  primaryCompanionName: string | null;
  secondaryCompanionName: string | null;
  clientSessionId: string | null;
  companionRole: string;
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

interface CompanionAcvitiyMonitor {
  selectedMode: string;
  companionCurrentStatus: string;
  QUEUE: {
    currentPosition: number;
  };
  PAYMENT_CALL: {
    active: boolean;
  };
  WAIT_ITEM: {
    active: boolean;
  };
  WAIT_OP: {
    active: boolean;
  };
  WITH_YOU: {
    active: boolean;
  };
  DEFAULT: {
    active: boolean;
  };
}


interface CompanionAcvitiyMonitor {
  [key: string]: any; // Allow any string key with any value type
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
        addItem: boolean;
        complete?:boolean;
        cancel: boolean;
      };
    };
    PAYMENT_CALL: {
      active: boolean;
      time: string;
      actionButtons: {
        addItem: boolean;
        complete?:boolean;
        cancel: boolean;
      };
    };
    WAIT_ITEM: {
      active: boolean;
      time: string;
      actionButtons: {
        addItem: boolean;
        complete?:boolean;
      };
    };
    WAIT_OP: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?:boolean;
      };
    };
    WITH_YOU: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?:boolean;
      };
    },
    DEFAULT: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?:boolean;
        cancel: boolean;
      };
    }
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
  CompanionAcvitiyMonitor: CompanionAcvitiyMonitor; // Add the new property
  setCompanionAcvitiyMonitor: (details: Partial<CompanionAcvitiyMonitor>) => void; // Add setter for CompanionAcvitiyMonitor
  getCompanionAcvitiyMonitor: () => CompanionAcvitiyMonitor; // Add getter for CompanionAcvitiyMonitor
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
  getPrimaryCompanionSessionId: () => string | null; // Getter for primaryCompanionSessionId
  getSecondaryCompanionSessionId: () => string | null; // Getter for secondaryCompanionSessionId
  setCompanionRestaurantManage: (details: Partial<CompanionRestaurantManage>) => void; // Add setter
  getCompanionRestaurantManage: () => CompanionRestaurantManage; // Add getter
  setCurrentPosition: (position: number) => void; // Add setter for currentPosition
  setClientActivityMonitor: (details: Partial<ClientActivityMonitor>) => void; // Add setter
  getClientActivityMonitor: () => ClientActivityMonitor; // Add getter
}

const useCompanionStore = create<CompanionStore>((set) => ({
  isDevMode: false,
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
  serviceRunning: false,
  companionRestaurantManage: { // Initialize the new property
    isActive: false,
    clientMsg: [{
      msg_id: 1,
      itemName: 'juice',
      quantity: 2,
      comments: 'make it spicy',
    }],
  },
  CompanionAcvitiyMonitor: { // Initialize the new property
    selectedMode: '',
    companionCurrentStatus: '',
    QUEUE: {
      active: false,
      currentPosition: 0,
    },
    PAYMENT_CALL: {
      active: false,
    },
    WAIT_ITEM: {
      active: false,
    },
    WAIT_OP: {
      active: false,
    },
    WITH_YOU: {
      active: false,
    },
    DEFAULT: {
      active: false,
    },
  },
  ClientActivityMonitor: { // Initialize the new property
    modeTitle: "",
    currentStatus: ACTIVITY_STATUS.DEFAULT,
    currentMode: ACTIVITY_MODES.WITH_YOU,
    statusInfo: {
      QUEUE: {
        currentPosition: 2,
        active: false,
        approxTime: 0,
        actionButtons: {
          addItem: true,
          cancel: true,
        },
      },
      PAYMENT_CALL: {
        active: false,
        time: "",
        actionButtons: {
          addItem: false,
          cancel: true,
        },
      },
      WAIT_ITEM: {
        active: false,
        time: "",
        actionButtons: {
          addItem: false
        },
      },
      WAIT_OP: {
        active: false,
        actionButtons: {
          addItem: true,
          complete: true,
        }
      },
      WITH_YOU: {
        active: false,
        actionButtons: {
          addItem: false
        }
      },
      DEFAULT: {
        active: false,
        actionButtons: {
          addItem: false,
          cancel: true
        }
      },
    },
  },
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
 getPrimaryCompanionSessionId: () =>
 useCompanionStore.getState().clientCompanionDetails.primaryCompanionSessionId,
 getSecondaryCompanionSessionId: () =>
 useCompanionStore.getState().clientCompanionDetails.secondaryCompanionSessionId,
    })),
  getClientCompanionDetails: () => useCompanionStore.getState().clientCompanionDetails,
  setCompanionRole: (role) => set(state => ({ companionProfileDetails: { ...state.companionProfileDetails, companionRole: role } })),
  getCompanionRole: () => useCompanionStore.getState().companionProfileDetails.companionRole,
  // Implement the new getters and setters for companionRestaurantManage
  setCompanionRestaurantManage: (details) =>
    set((state) => ({
      companionRestaurantManage: { ...state.companionRestaurantManage, ...details },
    })),
  getCompanionRestaurantManage: () => useCompanionStore.getState().companionRestaurantManage,
  // Implement the new getters and setters for CompanionAcvitiyMonitor
  setCompanionAcvitiyMonitor: (details) =>
    set((state) => ({
      CompanionAcvitiyMonitor: { ...state.CompanionAcvitiyMonitor, ...details },
    })),
  getCompanionAcvitiyMonitor: () => useCompanionStore.getState().CompanionAcvitiyMonitor,

  setClientActivityMonitor: (details) =>
    set((state) => ({
      // Start with the current ClientActivityMonitor state
      ClientActivityMonitor: {
        ...state.ClientActivityMonitor,
        // Merge top-level properties from details. This will overwrite
        // existing top-level properties if they are also in details.
        ...details,
        // Explicitly handle companionFlow to perform a deep merge
      },
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