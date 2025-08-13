import { type ClassValue } from "clsx"
import { clsx } from "clsx";
import { database } from "@/lib/firebase";
import { useCompanionStore } from '@/store/store';
import { ref, update, remove, get, child, DatabaseReference, onValue, off } from "firebase/database";
import { twMerge } from "tailwind-merge"
import { COMPANION_ROLES, MSG_STATUS, CLIENT_INSTRUCTION_MANUAL, INSTRUCTION_STATUS_UI_MAP, CLIENT_INSTRUCTION_CONTENT } from "./constants";

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
  companionProfileDetails: {
    path: "companionProfileDetails",
    primaryCompanionName: "companionProfileDetails/primaryCompanionName",
    secondaryCompanionName: "companionProfileDetails/secondaryCompanionName",
    clientSessionId: "companionProfileDetails/clientSessionId",
    companionRole: "companionProfileDetails/companionRole",
  },
  clientCompanionDetails: {
    path: "clientCompanionDetails",
    primaryCompanionSessionId: "clientCompanionDetails/primaryCompanionSessionId",
    secondaryCompanionSessionId: "clientCompanionDetails/secondaryCompanionSessionId",
  },
  serviceRunning: "serviceRunning",
  connectionStatus: "connectionStatus",
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
        actionButtons: "ClientActivityMonitor/statusInfo/PAYMENT_CALL/actionButtons",
      },
      WAIT_ITEM: { 
        path: "ClientActivityMonitor/statusInfo/WAIT_ITEM", 
        active: "ClientActivityMonitor/statusInfo/WAIT_ITEM/active", 
        time: "ClientActivityMonitor/statusInfo/WAIT_ITEM/time", 
        actionButtons: "ClientActivityMonitor/statusInfo/WAIT_ITEM/actionButtons" 
      },
      WAIT_OP: { 
        path: "ClientActivityMonitor/statusInfo/WAIT_OP", 
        active: "ClientActivityMonitor/statusInfo/WAIT_OP/active", 
        actionButtons: "ClientActivityMonitor/statusInfo/WAIT_OP/actionButtons" 
      },
      WITH_YOU: { 
        path: "ClientActivityMonitor/statusInfo/WITH_YOU", 
        active: "ClientActivityMonitor/statusInfo/WITH_YOU/active", 
        actionButtons: "ClientActivityMonitor/statusInfo/WITH_YOU/actionButtons" 
      },
      DEFAULT: {
        path: "ClientActivityMonitor/statusInfo/DEFAULT",
        active: "ClientActivityMonitor/statusInfo/DEFAULT/active",
        actionButtons: "ClientActivityMonitor/statusInfo/DEFAULT/actionButtons",
      },
    },
    companionFlow: { 
      path: "ClientActivityMonitor/companionFlow", 
      selectedMode: "ClientActivityMonitor/companionFlow/selectedMode" 
    },
  },
  CompanionAcvitiyMonitor: {
    path: "CompanionAcvitiyMonitor",
    sendCompanionMsgQueue: "CompanionAcvitiyMonitor/sendCompanionMsgQueue",
    recieveCompanionMsgQueue: "CompanionAcvitiyMonitor/recieveCompanionMsgQueue",
    selectedMode: "CompanionAcvitiyMonitor/selectedMode",
    companionCurrentStatus: "CompanionAcvitiyMonitor/companionCurrentStatus",
    selectedSubMode: "CompanionAcvitiyMonitor/selectedSubMode",
    QUEUE: {
      path: "CompanionAcvitiyMonitor/QUEUE",
      active: "CompanionAcvitiyMonitor/QUEUE/active",
      currentPosition: "CompanionAcvitiyMonitor/QUEUE/currentPosition",
    },
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
};

export function extractDataFromStore(storeObject: any): any {
  const data: any = {};
  for (const key in storeObject) {
    if (Object.prototype.hasOwnProperty.call(storeObject, key)) {
      const value = storeObject[key];
      // Skip functions and methods
      if (typeof value === 'function') {
        continue;
      }
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively filter nested objects
        const nestedData = extractDataFromStore(value);
        // Only add if the nested object has data (not empty)
        if (Object.keys(nestedData).length > 0) {
          data[key] = nestedData;
        }
      } else {
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
  
  if (!sessionId) {
    console.error("Session ID is not available. Cannot update store in Firebase.");
    return;
  }
  
  if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
    console.error("No data to update. Cannot update store in Firebase.");
    return;
  }
  
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
  if (!sessionId) {
    console.error("Session ID is null or undefined. Cannot check session existence.");
    return false;
  }
  
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
  if (!clientSessionId) {
    console.error("Client session ID is null or undefined. Cannot update companion session ID.");
    return;
  }
  
  if (!companionSessionId) {
    console.error("Companion session ID is null or undefined. Cannot update companion session ID.");
    return;
  }
  
  if (!companionRole) {
    console.error("Companion role is null or undefined. Cannot update companion session ID.");
    return;
  }
  
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
  console.log('updateValueInClient called with:', updateObj);
  console.log('Client session ID from store:', clientSessionId);
  
  if (!clientSessionId) {
    console.error('Client session ID is null or undefined. Cannot update client Firebase.');
    return;
  }
  
  if (!updateObj) {
    console.error('Update object is null or undefined. Cannot update client Firebase.');
    return;
  }
  
  if (!updateObj.path) {
    console.error('Update path is null or undefined. Cannot update client Firebase.');
    return;
  }
  
  if (updateObj.val === null || updateObj.val === undefined || (typeof updateObj.val === 'object' && updateObj.val !== null && Object.keys(updateObj.val).length === 0)) {
    console.error('Update value is null or undefined. Cannot update client Firebase.');
    return;
  }
  
  // Log specific message queue updates
  if (updateObj.path === 'sendClientMsgQueue') {
    console.log(`🔍 CLIENT MESSAGE QUEUE UPDATE - Path: ${updateObj.path}, Value:`, updateObj.val);
  }
  
  try {
    // Construct the reference to the specific path within the client's object
    const targetRef = ref(database, `storeObjects/${clientSessionId}/${updateObj.path}`);
    console.log('Firebase path to be updated:', `storeObjects/${clientSessionId}/${updateObj.path}`);
    console.log('value to be updated', updateObj.val);

    // Read the existing data at the target path
    const snapshot = await get(targetRef);
    const existingData = snapshot.val();
    console.log('Existing data at path:', existingData);

    // Check if the existing data is an array
    if (Array.isArray(existingData)) {
      // If it's an array, append the new value
      const updatedArray = [...existingData, updateObj.val];
      await update(ref(database, `storeObjects/${clientSessionId}`), { [updateObj.path]: updatedArray });
      console.log('Updated array in Firebase');
    } else {
      // If it's not an array, perform a regular update
      await update(ref(database, `storeObjects/${clientSessionId}`), { [updateObj.path]: updateObj.val });
      console.log('Updated object in Firebase');
    }
    console.log(`Value updated successfully for client ${clientSessionId} at path ${updateObj.path}`);
   } catch (error) {
    console.error(`Error updating value for client ${clientSessionId} at path ${updateObj.path}:`, error);
    // Optionally re-throw the error or handle it based on your needs
   }
}

export async function updateValueInCompanion(updateObj: { path: string, val: any }, role: string) {
  const companionSessionId = role === COMPANION_ROLES.PRIMARY
    ? useCompanionStore.getState().getPrimaryCompanionSessionId()
    : useCompanionStore.getState().getSecondaryCompanionSessionId();
  if (!companionSessionId) {
    console.error("Primary companion session ID is not available. Cannot update.");
    return;
  }
  
  if (!updateObj) {
    console.error('Update object is null or undefined. Cannot update companion Firebase.');
    return;
  }
  
  if (!updateObj.path) {
    console.error('Update path is null or undefined. Cannot update companion Firebase.');
    return;
  }
  
  if (updateObj.val === null || updateObj.val === undefined || (typeof updateObj.val === 'object' && updateObj.val !== null && Object.keys(updateObj.val).length === 0)) {
    console.error('Update value is null or undefined. Cannot update companion Firebase.');
    return;
  }
  
  if (!role) {
    console.error('Role is null or undefined. Cannot update companion Firebase.');
    return;
  }
  
  try {
    const targetRef = ref(database, `storeObjects/${companionSessionId}/${updateObj.path}`);
    console.log('path to be updated', updateObj.path);
    console.log('value to be updated', updateObj.val);

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
    console.log(`Value updated successfully for ${role} companion ${companionSessionId} at path ${updateObj.path}`);
  } catch (error) {
    console.error(`Error updating value for ${role} companion ${companionSessionId} at path ${updateObj.path}:`, error);
    // Optionally re-throw the error or handle it based on your needs
  }
}

/**
 * Updates a value in Firebase at the given key path for the current running session.
 * @param {string} path - The key path in the session's Firebase object to update (e.g., 'profileDetails/name').
 * @param {any} val - The value to set at the specified path.
 */
export async function updateInSelfFirebase(path: string, val: any) {
  const sessionId = useCompanionStore.getState().getSessionId();
  console.log('updateInSelfFirebase called with path:', path, 'val:', val);
  console.log('Session ID from store:', sessionId);
  
  if (!sessionId) {
    console.error("Session ID is not available. Cannot update.");
    return;
  }
  
  if (!path) {
    console.error("Path is null or undefined. Cannot update Firebase.");
    return;
  }
  
  if (val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length === 0)) {
    console.error("Value is null or undefined. Cannot update Firebase.");
    return;
  }
  
  // Log specific message queue updates
  if (path === 'CompanionAcvitiyMonitor/recieveCompanionMsgQueue' || path === 'ClientActivityMonitor/sendClientMsgQueue') {
    console.log(`🔍 MESSAGE QUEUE UPDATE - Path: ${path}, Value:`, val);
  }
  
  try {
    const targetRef = ref(database, `storeObjects/${sessionId}/${path}`);
    console.log('Firebase path to be updated:', `storeObjects/${sessionId}/${path}`);
    console.log('value to be updated', val);
    
    // Read the existing data at the target path
    const snapshot = await get(targetRef);
    const existingData = snapshot.val();
    console.log('Existing data at path:', existingData);

    // If the existing data is an array, append the new value
    if (Array.isArray(existingData)) {
      const updatedArray = [...existingData, val];
      await update(ref(database, `storeObjects/${sessionId}`), { [path]: updatedArray });
      console.log('Updated array in Firebase');
    } else {
      // Otherwise, just update the value
      await update(ref(database, `storeObjects/${sessionId}`), { [path]: val });
      console.log('Updated object in Firebase');
    }
    console.log(`Value updated successfully for session ${sessionId} at path ${path}`);
    console.log(val);
  } catch (error) {
    console.error(`Error updating value for session ${sessionId} at path ${path}:`, error);
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
  if (!messageType) {
    console.error("Message type is null or undefined. Cannot send message to client.");
    return;
  }
  
  if (!messageData) {
    console.error("Message data is null or undefined. Cannot send message to client.");
    return;
  }
  
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
  if (!messageType) {
    console.error("Message type is null or undefined. Cannot send message to companion.");
    return;
  }
  
  if (!messageData) {
    console.error("Message data is null or undefined. Cannot send message to companion.");
    return;
  }
  
  if (!companionRole) {
    console.error("Companion role is null or undefined. Cannot send message to companion.");
    return;
  }
  
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
  // Only process valid messages, ignore null/empty values
  if (!clientActionMessage || (typeof clientActionMessage === 'object' && Object.keys(clientActionMessage).length === 0)) {
    console.log('Received empty/null message from client, ignoring');
    return;
  }

  console.log('message from client');
  console.log(clientActionMessage);

  const currentStore = useCompanionStore.getState();
  // Set the incoming object directly to recieveCompanionMsgQueue
  currentStore.setRecieveCompanionMsgQueue(clientActionMessage);
}

export async function listenToCompaionRecieveQueue() {
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
  // Only process valid messages, ignore null/empty values
  if (!companionActionMsg || (typeof companionActionMsg === 'object' && Object.keys(companionActionMsg).length === 0)) {
    console.log('Received empty/null message from companion, ignoring');
    return;
  }

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

/**
 * Listen to a specific key in a user's Firebase store and call the callback on value change.
 * @param sessionId - The session ID (user or companion)
 * @param keyPath - The path to the key inside storeObjects/{sessionId}/
 * @param callback - Function to call with the new value
 * @returns Unsubscribe function
 */
export function listenToFirebaseKey(sessionId: string, keyPath: string, callback: (val: any) => void) {
  if (!sessionId) return () => {};
  const keyRef = ref(database, `storeObjects/${sessionId}/${keyPath}`);
  const listener = onValue(keyRef, (snapshot) => {
    callback(snapshot.val());
  });
  return () => off(keyRef, 'value', listener as any);
}

export function createClientInstructionProp(instruction: string) {
  // Get the current mode from the store
  const currentStore = useCompanionStore.getState();
  const currentMode = currentStore.ClientActivityMonitor.currentMode;
  
  // Get the instruction content from CLIENT_INSTRUCTION_CONTENT based on mode and instruction
  const modeContent = CLIENT_INSTRUCTION_CONTENT[currentMode as keyof typeof CLIENT_INSTRUCTION_CONTENT];
  const instructionContent = modeContent?.[instruction as keyof typeof modeContent];
  
  if (instructionContent) {
    return { 
      title: instructionContent.title, 
      description: instructionContent.description 
    };
  }
  
  // Fallback to the old method if content is not found
  const modeInstructions = CLIENT_INSTRUCTION_MANUAL[currentMode as keyof typeof CLIENT_INSTRUCTION_MANUAL];
  const instructionTitle = modeInstructions?.[instruction as keyof typeof modeInstructions] || instruction;
  
  return { title: instructionTitle };
}

export function createCompanionMessageObject(instruction: string) {
  const currentStore = useCompanionStore.getState();
  const currentMode = currentStore.ClientActivityMonitor.currentMode;
  const currentStatus = currentStore.ClientActivityMonitor.currentStatus;
  
  return {
    instruction: instruction,
    mode: currentMode,
    status: currentStatus,
    clientSessionId: currentStore.getSessionId()
  };
}

/**
 * Get mapped UI text for current instruction and status
 */
export function getInstructionStatusText(instructionObj: any): string {
  if (!instructionObj || !instructionObj.type || !instructionObj.status) {
    return 'No instruction';
  }

  const statusText = INSTRUCTION_STATUS_UI_MAP[instructionObj.type]?.[instructionObj.status]?.text;
  return statusText || 'Unknown instruction status';
}

export async function handleManualCompanionSessionIdSubmit(inputValue: string) {
  if (!inputValue.trim()) {
    console.warn('Please enter a companion session ID');
    return;
  }

  try {
    // Fetch the store data from Firebase using the provided session ID
    const storeRef = ref(database, `storeObjects/${inputValue}`);
    const snapshot = await get(storeRef);
    
    if (snapshot.exists()) {
      const firebaseStoreData = snapshot.val();
      console.log('Fetched store data from Firebase:', firebaseStoreData);
      
      // Update the local store with specific Firebase data
      const currentStore = useCompanionStore.getState();
      
      // Update basic session properties
      if (firebaseStoreData.sessionId) {
        currentStore.setSessionId(firebaseStoreData.sessionId);
      } else {
        currentStore.setSessionId(inputValue);
      }
      
      if (firebaseStoreData.matchingId) {
        currentStore.setMatchingId(firebaseStoreData.matchingId);
      }
      
      if (firebaseStoreData.matchingDone !== undefined) {
        currentStore.setMatchingDone(firebaseStoreData.matchingDone);
      }
      
      if (firebaseStoreData.serviceSelected) {
        currentStore.setServiceSelected(firebaseStoreData.serviceSelected);
      }
      
      if (firebaseStoreData.profileDetails) {
        currentStore.setProfileDetails(firebaseStoreData.profileDetails);
      }
      
      if (firebaseStoreData.serviceRunning !== undefined) {
        currentStore.setServiceRunning(firebaseStoreData.serviceRunning);
      }
      
      if (firebaseStoreData.isComplete !== undefined) {
        currentStore.setIsComplete(firebaseStoreData.isComplete);
      }
      
      // Update companion-specific properties
      if (firebaseStoreData.companionProfileDetails) {
        currentStore.setCompanionProfileDetails(firebaseStoreData.companionProfileDetails);
      }
      
      if (firebaseStoreData.CompanionAcvitiyMonitor) {
        currentStore.setCompanionAcvitiyMonitor(firebaseStoreData.CompanionAcvitiyMonitor);
      }
      
      console.log('Successfully updated local store with Firebase data for session:', inputValue);
      return true;
    } else {
      console.warn('Companion session not found in Firebase');
      return false;
    }
  } catch (error) {
    console.error('Error fetching and updating store data:', error);
    return false;
  }
}

export async function handleManualSessionIdSubmit(
  manualSessionId: string,
  setSessionId: (sessionId: string) => void,
  setManualSessionId: (sessionId: string) => void,
  setIsConnecting: (isConnecting: boolean) => void
) {
  if (!manualSessionId.trim()) {
    console.warn('Please enter a session ID');
    return;
  }

  setIsConnecting(true);
  try {
    const sessionExists = await checkIfSessionExistsAndMatch(manualSessionId);
    if (sessionExists) {
      setSessionId(manualSessionId);
      console.log('Successfully connected to session:', manualSessionId);
      setManualSessionId(''); // Clear input after successful connection
    } else {
      console.warn('Session not found or invalid');
    }
  } catch (error) {
    console.error('Error connecting to session:', error);
  } finally {
    setIsConnecting(false);
  }
}

export async function getClientChangePermission(changeKey: string, changeValue: any) {
  try {
    // Get current session ID
    const sessionId = useCompanionStore.getState().getSessionId();
    if (!sessionId) {
      console.warn('No session ID available for permission check');
      return false;
    }

    // Get companion role from store
    const companionRole = useCompanionStore.getState().getCompanionRole();
    if (!companionRole) {
      console.warn('No companion role available for permission check');
      return false;
    }

    // Define role-based permissions for different keys
    const primaryCompanionAllowed: Record<string, boolean> = {
      // Client Activity Monitor
      [storePaths.ClientActivityMonitor.currentMode]: true,
    };

    const secondaryCompanionAllowed: Record<string, boolean> = {
    };

    // Check permissions based on role
    let hasPermission = false;
    
    if (companionRole.toUpperCase() === COMPANION_ROLES.PRIMARY) {
      hasPermission = primaryCompanionAllowed[changeKey] || false;
    } else if (companionRole.toUpperCase() === COMPANION_ROLES.SECONDARY) {
      hasPermission = secondaryCompanionAllowed[changeKey] || false;
    } else {
      console.warn(`Unknown companion role: ${companionRole}`);
      return false;
    }

    if (!hasPermission) {
      console.warn(`Permission denied: ${companionRole} companion cannot modify key: ${changeKey}`);
      return false;
    }

    console.log(`Permission granted for change: ${changeKey} = ${changeValue} by ${companionRole} companion`);
    return true;
  } catch (error) {
    console.error('Error checking client change permission:', error);
    return false;
  }
}

// Prefetch instruction images for better performance
export const prefetchInstructionImages = () => {
  const instructionImages = [
    '/images/instructions/BRING_STAFF.png',
    '/images/instructions/CLOSE_ASSIST.png',
    '/images/instructions/I_AM_DONE.png',
    '/images/instructions/ORDER_CALL.png',
    '/images/instructions/PHOTO.png',
    '/images/instructions/QUEUE.png',
    '/images/instructions/WAIT_OP.png'
  ];

  instructionImages.forEach(imagePath => {
    const img = new Image();
    img.src = imagePath;
  });
};