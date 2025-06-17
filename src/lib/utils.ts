import { clsx, type ClassValue } from "clsx"
import { database } from '@/lib/firebase';
import { useCompanionStore } from '@/store/store';
import { ref, update, remove, get, child, DatabaseReference } from "firebase/database";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function getStoreRef(sessionId: string) {
  return ref(database, `storeObjects/${sessionId}`);
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


