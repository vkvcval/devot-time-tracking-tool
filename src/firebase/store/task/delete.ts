import firebase_app from '@/firebase/config';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const db = getFirestore(firebase_app);

export async function deleteTask(uid: string) {
  let result = null;
  let error = null;

  try {
    result = await deleteDoc(doc(db, 'task', uid));
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: any | null; error: FirebaseError | null };
}
