import firebase_app from '@/firebase/config';
import { ActiveTask } from '@/interfaces';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(firebase_app);

export default async function getActiveTask(userUid: string) {
  let result: ActiveTask | null = null;
  let error = null;

  try {
    const docRef = doc(db, 'activeTask', userUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      result = docSnap.data() as ActiveTask;
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
}
