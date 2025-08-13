import { ACTIVITY_STATUS, ACTIVITY_MODES, MSG_STATUS } from '@/lib/constants';
import { create } from 'zustand';
import { updateInSelfFirebase } from '@/lib/utils';
import { storePaths } from '@/lib/utils';

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
  sendCompanionMsgQueue: object[]; // Queue for messages to be sent by the companion
  recieveCompanionMsgQueue: any; // Queue for messages received by the companion (changed to any)
  selectedMode: string;
  companionCurrentStatus: string;
  selectedSubMode: string;

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
  sendClientMsgQueue: object; // Queue for messages to be sent by the client (changed to object)
  recieveClientMsgQueue: any[]; // Queue for messages received by the client
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
        complete?: boolean;
        cancel: boolean;
      };
    };
    PAYMENT_CALL: {
      active: boolean;
      time: string;
      actionButtons: {
        addItem: boolean;
        complete?: boolean;
        cancel: boolean;
      };
    };
    WAIT_ITEM: {
      active: boolean;
      time: string;
      actionButtons: {
        addItem: boolean;
        complete?: boolean;
      };
    };
    WAIT_OP: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?: boolean;
      };
    };
    WITH_YOU: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?: boolean;
      };
    },
    DEFAULT: {
      active: boolean;
      actionButtons: {
        addItem: boolean;
        complete?: boolean;
        cancel: boolean;
      };
    }
  };
}

interface CompanionStore {
  isDevMode: boolean;
  sessionId: string;
  connectionStatus: 'connected' | 'not-connected';
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
  setConnectionStatus: (status: 'connected' | 'not-connected') => void;
  getConnectionStatus: () => 'connected' | 'not-connected';
  setMatchingId: (id: string) => void;
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
  setClientSessionId: (id: string) => void;
  getClientSessionId: () => string | null;
  getPrimaryCompanionSessionId: () => string | null; // Getter for primaryCompanionSessionId
  getSecondaryCompanionSessionId: () => string | null; // Getter for secondaryCompanionSessionId
  setCompanionRestaurantManage: (details: Partial<CompanionRestaurantManage>) => void; // Add setter
  getCompanionRestaurantManage: () => CompanionRestaurantManage; // Add getter
  setCurrentPosition: (position: number) => void; // Add setter for currentPosition
  setClientActivityMonitor: (details: Partial<ClientActivityMonitor>) => void; // Add setter
  getClientActivityMonitor: () => ClientActivityMonitor; // Add getter
  setRecieveCompanionMsgQueue: (obj: any) => void; // Keep as any for now
  setSelectedSubMode: (subMode: string) => void;
  getSelectedSubMode: () => string;
}

const useCompanionStore = create<CompanionStore>((set) => ({
  isDevMode: false,
  setIsDevMode: (isDev) => set({ isDevMode: isDev }), // Implement setter
  getIsDevMode: () => useCompanionStore.getState().isDevMode, // Implement getter
  sessionId: '',
  connectionStatus: 'not-connected',
  matchingId: '',
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
    sendCompanionMsgQueue: [{ data: 'initial_data' }],
    // Initialize recieveCompanionMsgQueue as an empty object
    recieveCompanionMsgQueue: {
      test:1
    },
    selectedMode: ACTIVITY_MODES.WITH_YOU,
    companionCurrentStatus: ACTIVITY_STATUS.DEFAULT,
    selectedSubMode: '',

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
  companionProfileDetails: {
    clientSessionId: '',
    companionRole: '',
    primaryCompanionName: '',
    secondaryCompanionName: '',
  },
  clientCompanionDetails: {
    primaryCompanionSessionId: '',
    secondaryCompanionSessionId: '',
    getPrimaryCompanionSessionId: () => useCompanionStore.getState().clientCompanionDetails.primaryCompanionSessionId,
    getSecondaryCompanionSessionId: () => useCompanionStore.getState().clientCompanionDetails.secondaryCompanionSessionId,
  },
  ClientActivityMonitor: { // Initialize the new property
    // Initialize sendClientMsgQueue as an empty object
    sendClientMsgQueue: {test:1},
    recieveClientMsgQueue: [{ data: 'initial_data' }],
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
  setSessionId: (id) => {
    set({ sessionId: id });
    // Store sessionId in localStorage
    localStorage.setItem('sessionId', id);
  },
  getSessionId: () => useCompanionStore.getState().sessionId,
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  getConnectionStatus: () => useCompanionStore.getState().connectionStatus,
  setMatchingDone: (done) => set({ matchingDone: done }),
  setMatchingId: (id) => set({ matchingId: id }),
  setServiceSelected: (service) => set({ serviceSelected: service }),
  setClientSessionId: (id) => set(state => ({ companionProfileDetails: { ...state.companionProfileDetails, clientSessionId: id } })),
  getClientSessionId: () => useCompanionStore.getState().companionProfileDetails.clientSessionId,
  setServiceSelection: (selection) => set({ serviceSelection: selection }),
  setCurrentPosition: (position) => set(state => ({ 
    ClientActivityMonitor: { 
      ...state.ClientActivityMonitor, 
      statusInfo: { 
        ...state.ClientActivityMonitor.statusInfo, 
        QUEUE: { 
          ...state.ClientActivityMonitor.statusInfo.QUEUE, 
          currentPosition: position 
        } 
      } 
    } 
  })),
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
  setCompanionRole: (role) => {
    set(state => ({ companionProfileDetails: { ...state.companionProfileDetails, companionRole: role } }));
    // Update Firebase with the new companion role
    updateInSelfFirebase(storePaths.companionProfileDetails.companionRole, role);
  },
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

  setProfileDetails: (details: Partial<ProfileDetails>) =>
    set((state) => ({
      profileDetails: { ...state.profileDetails, ...details },
    })),

  getClientActivityMonitor: () => useCompanionStore.getState().ClientActivityMonitor,

  // Getters for message queues
  getSendCompanionMsgQueue: () => useCompanionStore.getState().CompanionAcvitiyMonitor.sendCompanionMsgQueue,
  getRecieveCompanionMsgQueue: () => useCompanionStore.getState().CompanionAcvitiyMonitor.recieveCompanionMsgQueue,
  // Setters for message queues - adds an object to the respective array
  setSendCompanionMsgQueue: (message: object) =>
    set((state) => ({
      CompanionAcvitiyMonitor: {
        ...state.CompanionAcvitiyMonitor,
        sendCompanionMsgQueue: [...state.CompanionAcvitiyMonitor.sendCompanionMsgQueue, message],
      },
    })),
  // Setter for receiveCompanionMsgQueue - sets the object directly
  setRecieveCompanionMsgQueue: (message: any) =>
    set((state) => ({
      CompanionAcvitiyMonitor: { ...state.CompanionAcvitiyMonitor, recieveCompanionMsgQueue: message },
    })),

  // Getter for sendClientMsgQueue (object)
  getSendClientMsgQueue: () => useCompanionStore.getState().ClientActivityMonitor.sendClientMsgQueue,
  getRecieveClientMsgQueue: () => useCompanionStore.getState().ClientActivityMonitor.recieveClientMsgQueue,
  // Setter for sendClientMsgQueue - sets the object directly
  setSendClientMsgQueue: (message: object) =>
    set((state) => ({
      ClientActivityMonitor: { ...state.ClientActivityMonitor, sendClientMsgQueue: message }, // Set the object directly
    })),
  setRecieveClientMsgQueue: (message: object) =>
    set((state) => ({
      ClientActivityMonitor: { ...state.ClientActivityMonitor, recieveClientMsgQueue: [...state.ClientActivityMonitor.recieveClientMsgQueue, message] },
    })),

  reset: () =>
    set({
      isComplete: false, // Reset isComplete on reset as well
      sessionId: '',
      serviceRunning: true,
      matchingId: "",
      serviceSelected: "",
      profileDetails: {}
    }),
  setSelectedSubMode: (subMode) => set((state) => ({
    CompanionAcvitiyMonitor: { ...state.CompanionAcvitiyMonitor, selectedSubMode: subMode },
  })),
  getSelectedSubMode: () => useCompanionStore.getState().CompanionAcvitiyMonitor.selectedSubMode,
  getPrimaryCompanionSessionId: () => useCompanionStore.getState().clientCompanionDetails.primaryCompanionSessionId,
  getSecondaryCompanionSessionId: () => useCompanionStore.getState().clientCompanionDetails.secondaryCompanionSessionId,
}));

export { useCompanionStore };

// TODO: In the component for the end-service route,
// call the 'endServiceInDb' method from utils
// when the session is considered ended.