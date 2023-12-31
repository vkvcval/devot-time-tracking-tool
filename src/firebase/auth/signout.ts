import firebase_app from '@/firebase/config';
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth(firebase_app);

export default async function () {
  let result = null;
  let error = null;

  try {
    result = await signOut(auth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
