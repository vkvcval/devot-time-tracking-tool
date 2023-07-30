import firebase_app from '@/firebase/config';
import { getCurrentUTCDate } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

const db = getFirestore(firebase_app);

export default async function createNewTask({ userUid, description }: { userUid: string; description: string }) {
  let result = null;
  let error = null;

  const data = {
    userUid,
    description,
    startDate: getCurrentUTCDate(),
  };

  try {
    // add new task
    result = await addDoc(collection(db, 'task'), data);
    if (result?.id) {
      // update user's active task
      await setDoc(doc(db, 'activeTask', userUid), { activeTaskUid: result.id }, { merge: true });
    }
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: any | null; error: FirebaseError | null };
}
