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
  startAfter,
  limit,
  QuerySnapshot,
  QueryFieldFilterConstraint,
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

export async function getRunningTasks(userUid: string, after: QueryFieldFilterConstraint) {
  let list: Task[] = [];
  let activeTaskUid: string | null = null;
  let snapshot = null;
  let error = null;

  try {
    const q = [where('userUid', '==', userUid), where('status', '==', task_status.RUNNING)];
    /*   if (after) q.push(after); */
    /*     snapshot = await getDocs(
      query(
        collection(db, 'task'),
        where('userUid', '==', userUid),
        where('startDate', '==', getCurrentUTCDate()),
        limit(2)
      )
    ); */
    snapshot = await getDocs(query(collection(db, 'task'), ...q));
    snapshot.forEach(doc => list.push({ ...doc.data(), uid: doc.id } as Task));

    const activeTask = await getActiveTask(userUid);
    if (activeTask.result?.activeTaskUid) {
      activeTaskUid = activeTask.result.activeTaskUid;
    }

    /*     const lista2 = [];
    const another = await getDocs(
      query(
        collection(db, 'task'),
        where('userUid', '==', userUid),
        where('startDate', '==', getCurrentUTCDate()),
        limit(2),
        startAfter(snapshot.docs[snapshot.docs.length - 1])
      )
    );
    another.forEach(doc => lista2.push({ ...doc.data(), uid: doc.id } as Task)); */
  } catch (e) {
    error = e;
  }

  return { result: { list, snapshot, activeTaskUid }, error };
}
