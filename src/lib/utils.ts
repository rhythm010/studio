import { type ClassValue } from "tailwind-merge"
import { clsx } from "clsx";
import { database } from "@/lib/firebase";
import { useCompanionStore } from '@/store/store';
import { ref, update, remove, get, child, DatabaseReference, onValue, off } from "firebase/database";
import { twMerge } from "tailwind-merge"
import { COMPANION_ROLES, MSG_STATUS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const storePaths = {
  isDevMode: "isDevMode",
  sessionId: "sessionId",
  matchingId: "matchingId",
  dev_session: "dev_session",
  matchingDone: "matchingDone",
  serviceSelected: "serviceSelected",
  profileDetails: {
    path: "profileDetails",
    // Assuming profileDetails keys are dynamic, we can't define static paths for them
    // You would construct the path dynamically like `profileDetails/${key}`
  },
  serviceSelection: {
    path: "serviceSelection",
    gender: "serviceSelection/gender",
    package: "serviceSelection/package",
  },
  feedbackDetails: "feedbackDetails",
  companionFeedbackDetails: "companionFeedbackDetails",
  isComplete: "isComplete",
 ClientCompanionDetails: {
 path: "clientCompanionDetails",
  },
  serviceRunning: "serviceRunning",
  companionQueueManage: {
    path: "companionQueueManage",
    queueActivated: "companionQueueManage/queueActivated",
    currentPosition: "companionQueueManage/currentPosition",
  },
  companionRestaurantManage: {
    path: "companionRestaurantManage",
    isActive: "companionRestaurantManage/isActive",
    clientMsg: "companionRestaurantManage/clientMsg",
    // Assuming clientMsg is an array of objects, individual message paths would be dynamic like `companionRestaurantManage/clientMsg/${index}`
  },
  ClientActivityMonitor: {
 sendClientMsgQueue: "ClientActivityMonitor/sendClientMsgQueue",
 recieveClientMsgQueue: "ClientActivityMonitor/recieveClientMsgQueue",
    path: "ClientActivityMonitor",
    modeTitle: "ClientActivityMonitor/modeTitle",
    currentMode: "ClientActivityMonitor/currentMode",
    currentStatus: "ClientActivityMonitor/currentStatus",
    statusInfo: {
      path: "ClientActivityMonitor/statusInfo",
      QUEUE: {
        path: "ClientActivityMonitor/statusInfo/QUEUE",
        active: "ClientActivityMonitor/statusInfo/QUEUE/active",
        currentPosition: "ClientActivityMonitor/statusInfo/QUEUE/currentPosition",
        approxTime: "ClientActivityMonitor/statusInfo/QUEUE/approxTime",
        actionButtons: "ClientActivityMonitor/statusInfo/QUEUE/actionButtons",
      },
      PAYMENT_CALL: {
        path: "ClientActivityMonitor/statusInfo/PAYMENT_CALL",
        active: "ClientActivityMonitor/statusInfo/PAYMENT_CALL/active",
        time: "ClientActivityMonitor/statusInfo/PAYMENT_CALL/time",
        actionButtons: "ClientActivityMonitor/ClientActivityMonitor/statusInfo/PAYMENT_CALL/actionButtons",
      },
      WAIT_ITEM: { path: "ClientActivityMonitor/statusInfo/WAIT_ITEM", active: "ClientActivityMonitor/statusInfo/WAIT_ITEM/active", time: "ClientActivityMonitor/statusInfo/WAIT_ITEM/time", actionButtons: "ClientActivityMonitor/statusInfo/WAIT_ITEM/actionButtons" },
      WAIT_OP: { path: "ClientActivityMonitor/statusInfo/WAIT_OP", active: "ClientActivityMonitor/statusInfo/WAIT_OP/active", actionButtons: "ClientActivityMonitor/statusInfo/WAIT_OP/actionButtons" },
      WITH_YOU: { path: "ClientActivityMonitor/statusInfo/WITH_YOU", active: "ClientActivityMonitor/statusInfo/WITH_YOU/active", actionButtons: "ClientActivityMonitor/statusInfo/WITH_YOU/actionButtons" },
    },
    companionFlow: { path: "ClientActivityMonitor/companionFlow", selectedMode: "ClientActivityMonitor/companionFlow/selectedMode" },
  },
  CompanionAcvitiyMonitor: {
    path: "CompanionAcvitiyMonitor",
 sendCompanionMsgQueue: "CompanionAcvitiyMonitor/sendCompanionMsgQueue",
 recieveCompanionMsgQueue: "CompanionAcvitiyMonitor/recieveCompanionMsgQueue",
    selectedMode: "CompanionAcvitiyMonitor/selectedMode",
    companionCurrentStatus: "CompanionAcvitiyMonitor/companionCurrentStatus",
    PAYMENT_CALL: {
      path: "CompanionAcvitiyMonitor/PAYMENT_CALL",
      active: "CompanionAcvitiyMonitor/PAYMENT_CALL/active",
    },
    WAIT_ITEM: {
      path: "CompanionAcvitiyMonitor/WAIT_ITEM",
      active: "CompanionAcvitiyMonitor/WAIT_ITEM/active",
    },
    WAIT_OP: {
      path: "CompanionAcvitiyMonitor/WAIT_OP",
      active: "CompanionAcvitiyMonitor/WAIT_OP/active",
    },
    WITH_YOU: {
      path: "CompanionAcvitiyMonitor/WITH_YOU",
      active: "CompanionAcvitiyMonitor/WITH_YOU/active",
    },
    DEFAULT: {
      path: "CompanionAcvitiyMonitor/DEFAULT",
      active: "CompanionAcvitiyMonitor/DEFAULT/active",
    },
  },
  ClientMsgQueue: "ClientMsgQueue",
  CompanionMsgQueue: "CompanionMsgQueue",
};

export function extractDataFromStore(storeObject: any): any {
  const data: any = {};
  for (const key in storeObject) {
    if (Object.prototype.hasOwnProperty.call(storeObject, key)) {
      const value = storeObject[key];
      if (typeof value !== 'function') {
        data[key] = value;
      }
    }
  }
  return data;
}

export function getStoreRef(sessionId?: string) {
  return ref(database, `storeObjects/${sessionId || useCompanionStore.getState().getSessionId()}`);
}

export async function updateStoreInFirebase() {
  const sessionId = useCompanionStore.getState().getSessionId(); // Get session ID from the store
  const storeData = useCompanionStore.getState();
  const dataToUpdate = extractDataFromStore(storeData);
  try {
    const storeRef = getStoreRef(sessionId);
    await update(storeRef, dataToUpdate);
    console.log('store updated successfully');
  } catch (error) { 
    console.log('error in updating value');
    console.log(error);
  } // Handle or log the error appropriately
}

export async function removeDevSessions() {
  const storeRef = ref(database, 'storeObjects');
  try {
    // This approach reads all objects to filter, which might not be scalable
    // For production, consider backend filtering or a different data structure
    const snapshot = await get(storeRef);
    if (snapshot.exists()) {
      const objects = snapshot.val();
      for (const key in objects) {
        if (objects[key].dev_session === true) {
          const devSessionRef = ref(database, `storeObjects/${key}`);
          await remove(devSessionRef);
        }
      }
    }
  } catch (error) {
    console.error('Error removing dev sessions:', error);
    throw new Error('problem in creating session');
  }
}

export async function checkIfSessionExistsAndMatch(sessionId: string): Promise<any> {
  const dbRef = ref(database);
  try {
    const sessionRef: DatabaseReference = child(dbRef, `storeObjects/${sessionId}`);
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
      console.log("Session exists:", snapshot.val());
      // Update the matchingDone key to true
      await update(sessionRef, { matchingDone: true });
      console.log(`Matching updated to true for session: ${sessionId}`);
      return sessionId;
    } else {
      console.log("No data available for session:", sessionId);
    }
  } catch (error) {
    console.error("Error checking or fetching session:", error);
  }

  return false;
}

export async function updateCompanionSessionIdInClient(clientSessionId: string, companionSessionId: string, companionRole:string): Promise<void> {
  const clientRef = ref(database, 'storeObjects/' + clientSessionId);
  try {
    const snapshot = await get(child(clientRef, 'clientCompanionDetails'));
    if (snapshot.exists()) {
      // const clientCompanionDetails = snapshot.val();
      let updatePath: string;
      let updateValue: string | null;

      if (companionRole === 'Primary') {
        updatePath = 'clientCompanionDetails/primaryCompanionSessionId';
        updateValue = companionSessionId;
        console.log(`Updating primaryCompanionSessionId for client: ${clientSessionId}`);
      } else {
        updatePath = 'clientCompanionDetails/secondaryCompanionSessionId';
        updateValue = companionSessionId;
        console.log(`Updating secondaryCompanionSessionId for client: ${clientSessionId}`);
      }

      await update(clientRef, {
        [updatePath]: updateValue
      });
      console.log('ClientCompanionDetails updated successfully');
    } else {
      console.log("No clientCompanionDetails found for client:", clientSessionId);
    }
  } catch (error) {
    console.error("Error updating companion session ID for client:", error);
  }
}


export async function updateValueInClient(updateObj: { path: string, val: any }) {
  const clientSessionId = useCompanionStore.getState().getClientSessionId();
  try {
    // Construct the reference to the specific path within the client's object
    const targetRef = ref(database, `storeObjects/${clientSessionId}/${updateObj.path}`);
    console.log('path to be updated', updateObj.path);

    // Read the existing data at the target path
    const snapshot = await get(targetRef);
    const existingData = snapshot.val();

    // Check if the existing data is an array
    if (Array.isArray(existingData)) {
      // If it's an array, append the new value
      const updatedArray = [...existingData, updateObj.val];
      await update(ref(database, `storeObjects/${clientSessionId}`), { [updateObj.path]: updatedArray });
    } else {
      // If it's not an array, perform a regular update
      await update(ref(database, `storeObjects/${clientSessionId}`), { [updateObj.path]: updateObj.val });
    }
    console.log(`Value updated successfully for client ${clientSessionId} at path ${updateObj.path}`);
   } catch (error) {
    console.error(`Error updating value for client ${clientSessionId} at path ${updateObj.path}:`, error);
    // Optionally re-throw the error or handle it based on your needs
   }
}

export async function updateValueInCompanion(updateObj: { path: string, val: any }, role: string) {
  const companionSessionId = role === COMPANION_ROLES.PRIMARY ? useCompanionStore.getState().clientCompanionDetails.primaryCompanionSessionId:
                                  useCompanionStore.getState().clientCompanionDetails.secondaryCompanionSessionId;
  if (!companionSessionId) {
    console.error("Primary companion session ID is not available. Cannot update.");
    return;
  }
  try {
    const targetRef = ref(database, `storeObjects/${companionSessionId}/${updateObj.path}`);
    console.log('path to be updated', updateObj.path);

    // Read the existing data at the target path
    const snapshot = await get(targetRef);
    const existingData = snapshot.val();

    // Check if the existing data is an array
    if (Array.isArray(existingData)) {
      // If it's an array, append the new value
      const updatedArray = [...existingData, updateObj.val];
      await update(ref(database, `storeObjects/${companionSessionId}`), { [updateObj.path]: updatedArray });
    } else {
      // If it's not an array, perform a regular update
      await update(ref(database, `storeObjects/${companionSessionId}`), { [updateObj.path]: updateObj.val });
    }
    console.log(`Value updated successfully for client ${companionSessionId} at path ${updateObj.path}`);
  } catch (error) {
    console.error(`Error updating value for primary companion ${companionSessionId} at path ${updateObj.path}:`, error);
    // Optionally re-throw the error or handle it based on your needs
  }
}


// Async function to send messages to the client

function formMessageObj(messageType: string, messageData: object, messageSender:string) {
  const msgObj = {
    id:`${messageSender}_${messageType}`,
    type:messageType,
    data:messageData,
    timestamp:Date.now(),
    active: true,
    status: MSG_STATUS.UNREAD,
  };

  return msgObj;
}

export async function sendMsgToClient(messageType: string, messageData: object) {
  const messageObj = formMessageObj(messageType, messageData, 'CLIENT');
  const clientSessionId = useCompanionStore.getState().getClientSessionId();
  if (!clientSessionId) {
    console.error("Client session ID is not available. Cannot send message.");
    return;
  }
  try {
    console.log(`Sending message to client ${clientSessionId}:`, messageObj);
    updateValueInClient({ path:storePaths.ClientActivityMonitor.recieveClientMsgQueue , val: messageObj});
  } catch (error) {
    console.error(`Error sending message to client ${clientSessionId}:`, error);
  }
}


export async function sendMsgToCompanion(messageType: string, messageData: object, companionRole:string) {
  const messageObj = formMessageObj(messageType, messageData, 'COMPANION');
  const companionSessionId = companionRole === COMPANION_ROLES.PRIMARY ? useCompanionStore.getState().getPrimaryCompanionSessionId():
                          useCompanionStore.getState().getSecondaryCompanionSessionId() ;
  if (!companionSessionId) {
    console.error("Client session ID is not available. Cannot send message.");
    return;
  }
  try {
    console.log(`Sending message to client ${companionSessionId}:`, messageObj);
    updateValueInCompanion({ path:storePaths.CompanionAcvitiyMonitor.recieveCompanionMsgQueue , val: messageObj}, companionRole);
  } catch (error) {
    console.error(`Error sending message to client ${companionSessionId}:`, error);
  }
}

function actionOnClientMessage(clientActionMessage: any) {
  console.log('mesasge from client');
  console.log(clientActionMessage);

  const currentStore = useCompanionStore.getState();
  // Set the incoming object directly to recieveCompanionMsgQueue
  currentStore.setRecieveCompanionMsgQueue(clientActionMessage);
}

export async function listenToClientMessages() {
  // Get the client session ID from the store
  const companionSessionId = useCompanionStore.getState().getSessionId();

  if (!companionSessionId) {
    return () => {}; // Return a no-op unsubscribe function
  }

  // Construct the database reference to the recieveClientMsgQueue for this client session
  const messagesRef = ref(database, `storeObjects/${companionSessionId}/${storePaths.CompanionAcvitiyMonitor.recieveCompanionMsgQueue}`);

  // Set up the listener and return the unsubscribe function
  onValue(messagesRef, (snapshot) => {
    actionOnClientMessage(snapshot.val());
    // You can add logic here to process the received messages, e.g., update the store
  });
}

function actionOnCompanionMessage(companionActionMsg: any) {
  console.log('mesasge from companion');
  console.log(companionActionMsg);
}

export async function listenToPrimaryCompanionMessages() {
  // Get the client session ID from the store
  const clientSessionId = useCompanionStore.getState().getSessionId();

  if (!clientSessionId) {
    console.error("Client session ID is not available. Cannot listen for messages.");
    // Return a no-op unsubscribe function
 return () => {};
  }

  // Construct the database reference to the recieveClientMsgQueue for this client session
  const messagesRef = ref(database, `storeObjects/${clientSessionId}/${storePaths.ClientActivityMonitor.recieveClientMsgQueue}`);

  // Set up the listener
  onValue(messagesRef, (snapshot) => {
    actionOnCompanionMessage(snapshot.val());
    // You can add logic here to process the received messages, e.g., update the store
  });
}

export function changeClientMsgStatus(status: any) {
  const currentStore = useCompanionStore.getState();
  const currentMsg = currentStore.CompanionAcvitiyMonitor.recieveCompanionMsgQueue;

  // Check if currentMsg is an object and has a status property
  if (currentMsg && typeof currentMsg === 'object' && currentMsg.hasOwnProperty('status')) {
    // Create a new object with the updated status
    const updatedMsg = { ...currentMsg, status: status };
    // Update the local store with the new object
    currentStore.setRecieveCompanionMsgQueue(updatedMsg);

    console.log('Updated message status in local store');
    console.log(useCompanionStore.getState().CompanionAcvitiyMonitor.recieveCompanionMsgQueue);

    // Optionally, you might want to update this change in Firebase as well
    // updateValueInCompanion({ path: storePaths.CompanionAcvitiyMonitor.recieveCompanionMsgQueue + '/status', val: status }, currentStore.getCompanionRole());
  } else {
    console.error('recieveCompanionMsgQueue is not a valid message object. Cannot change status.');
  }
}

// Utility method to create an empty object for ClientFeatureExplainer props
export function createClientFeatureProp() {
  return {};
}

export function createCompanionMessageObject() {
  return {};
}




