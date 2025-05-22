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

export async function updateStoreInFirebase() {
  const sessionId = useCompanionStore.getState().getSessionId(); // Get session ID from the store
  const storeData = useCompanionStore.getState();
  const dataToUpdate = extractDataFromStore(storeData);
  const storeRef = ref(database, `storeObjects/${sessionId}`);
  try {
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

export async function checkIfSessionExistsAndMatch(sessionId: string): Promise<boolean> {
  const dbRef = ref(database);
  try {
    const sessionRef: DatabaseReference = child(dbRef, `storeObjects/${sessionId}`);
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
      console.log("Session exists:", snapshot.val());
      // Update the matchingDone key to true
      await update(sessionRef, { matchingDone: true });
      console.log(`Matching updated to true for session: ${sessionId}`);
      return true;
    } else {
      console.log("No data available for session:", sessionId);
    }
  } catch (error) {
    console.error("Error checking or fetching session:", error);
  }

  return false;
}



