import firebase_app from '@/firebase/config';
import { ActiveTask } from '@/interfaces';
import { Task } from '@/interfaces';
import { task_status } from '@/lib/constants';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  QueryFieldFilterConstraint,
  getCountFromServer,
} from 'firebase/firestore';

const db = getFirestore(firebase_app);

export async function getActiveTask(userUid: string) {
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

export async function getRunningTasksCount(userUid: string) {
  let error = null;
  let result = null;

  try {
    const collection_ = collection(db, 'task');
    const query_ = query(collection_, where('userUid', '==', userUid), where('status', '==', task_status.RUNNING));
    const snapshot = await getCountFromServer(query_);

    result = snapshot.data().count;
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function getRunningTasks(
  userUid: string,
  options: { startAfter?: QueryFieldFilterConstraint; endBefore?: QueryFieldFilterConstraint } = {}
) {
  let list: Task[] = [];
  let count = 0;
  let activeTaskUid: string | null = null;
  let snapshot = null;
  let error = null;

  try {
    const q = [where('userUid', '==', userUid), where('status', '==', task_status.RUNNING)];
    if (options.startAfter) q.push(options.startAfter);
    if (options.endBefore) q.push(options.endBefore);
    snapshot = await getDocs(query(collection(db, 'task'), ...q));
    snapshot.forEach(doc => list.push({ ...doc.data(), uid: doc.id } as Task));

    const activeTask = await getActiveTask(userUid);
    if (activeTask.result?.activeTaskUid) {
      activeTaskUid = activeTask.result.activeTaskUid;
    }

    const runningTasks = await getRunningTasksCount(userUid);
    if (runningTasks.result) {
      count = runningTasks.result;
    }
  } catch (e) {
    error = e;
  }

  return {
    result: {
      list: list.sort((a, b) => (a.uid === activeTaskUid ? -1 : a.timestamp > b.timestamp ? -1 : 0)),
      snapshot,
      activeTaskUid,
      count,
    },
    error,
  };
}
