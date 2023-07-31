import firebase_app from '@/firebase/config';
import { UpdateTaskData } from '@/interfaces';
import { task_status } from '@/lib/constants';
import { getCurrentUTCDate } from '@/lib/utils';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc, where, getDocs, query, collection } from 'firebase/firestore';
import getActiveTask from './get-active-task';

const db = getFirestore(firebase_app);

export async function updateTask(uid: string, data: UpdateTaskData) {
  let result = null;
  let error = null;

  try {
    // update user's active task
    await setDoc(doc(db, 'task', uid), data, { merge: true });
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: any | null; error: FirebaseError | null };
}

export async function updateActiveTask(userUid: string, activeTaskUid: string | null) {
  let result = null;
  let error = null;

  try {
    // update user's active task
    await setDoc(doc(db, 'activeTask', userUid), { activeTaskUid }, { merge: true });
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: any | null; error: FirebaseError | null };
}

export async function stopAllTasks(userUid: string) {
  let result = null;
  let error = null;
  let taksIds: string[] = [];

  try {
    const snapshot = await getDocs(
      query(collection(db, 'task'), where('userUid', '==', userUid), where('status', '==', task_status.RUNNING))
    );
    snapshot.forEach(doc => taksIds.push(doc.id));

    // remove active task from user
    const activeTask = await getActiveTask(userUid);
    if (activeTask.result?.activeTaskUid) {
      await updateActiveTask(userUid, null);
    }

    const data: UpdateTaskData = {
      status: task_status.COMPLETED,
      endDate: getCurrentUTCDate(),
    };
    for (const id of taksIds) {
      await updateTask(id, data);
    }
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: any | null; error: FirebaseError | null };
}
