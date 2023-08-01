import firebase_app from '@/firebase/config';
import { NewTask } from '@/interfaces';
import { task_status } from '@/lib/constants';
import { getCurrentUTCDate, getTimestamp } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

const db = getFirestore(firebase_app);

export async function createNewTask({ userUid, description }: { userUid: string; description: string }) {
  let result = null;
  let error = null;

  const data: NewTask = {
    userUid,
    description,
    startDate: getCurrentUTCDate(),
    endDate: null,
    loggedSeconds: 0,
    status: task_status.RUNNING,
    timestamp: getTimestamp(),
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
