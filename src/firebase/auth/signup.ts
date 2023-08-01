import firebase_app from '@/firebase/config';
import { FirebaseError } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';

const auth = getAuth(firebase_app);

export default async function signUp(email: string, password: string) {
  let result = null;
  let error = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error } as { result: UserCredential | null; error: FirebaseError | null };
}
