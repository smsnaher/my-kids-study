import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './config';

export interface UserData {
  uid: string;
  email: string;
  role: string;
  displayName?: string;
  createdAt: Timestamp;
}

// Register a new user
export const registerUser = async (email: string, password: string, role: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Save user data to Firestore
  const userData: UserData = {
    uid: user.uid,
    email: user.email!,
    displayName: displayName || '',
    role: role || 'teacher', // Default role, can be changed later
    createdAt: Timestamp.now()
  };
  
  await setDoc(doc(db, 'users', user.uid), userData);
  
  return { user, userData };
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout user
export const logoutUser = async () => {
  await signOut(auth);
};

// Update user role in Firestore
export const updateUserRole = async (uid: string, newRole: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { role: newRole });
};

// Get user data from Firestore
export const getUserData = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  } else {
    throw new Error('User data not found');
  }
};

// Add a document to a collection (example function for saving additional data)
export const addUserDocument = async (uid: string, collectionName: string, data: Record<string, unknown>) => {
  const docRef = await addDoc(collection(db, 'users', uid, collectionName), {
    ...data,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};
