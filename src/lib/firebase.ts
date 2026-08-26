import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { Book, BookmarkItem, HighlightItem, ReaderSettings } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  measurementId: firebaseConfigData.measurementId
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with Database ID if specified
const databaseId = firebaseConfigData.firestoreDatabaseId || '(default)';
export const db = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);

// ----------------- AUTHENTICATION HELPERS -----------------

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export const loginWithGoogle = async (): Promise<UserProfile> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Update or create user profile doc
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    userId: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    lastLoginAt: new Date().toISOString()
  }, { merge: true });

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  };
};

export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  };
};

export const registerWithEmail = async (email: string, pass: string, name: string): Promise<UserProfile> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const user = result.user;
  
  if (name) {
    await updateProfile(user, { displayName: name });
  }

  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, {
    userId: user.uid,
    email: user.email,
    displayName: name || user.email?.split('@')[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  }, { merge: true });

  return {
    uid: user.uid,
    email: user.email,
    displayName: name || user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  };
};

export const loginAsGuest = async (): Promise<UserProfile> => {
  const result = await signInAnonymously(auth);
  const user = result.user;
  return {
    uid: user.uid,
    email: null,
    displayName: 'Ospite eBookMe',
    photoURL: null,
    isAnonymous: true
  };
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ----------------- FIRESTORE DATA PERSISTENCE -----------------

/**
 * Strips undefined fields recursively to prevent Firestore 'unsupported field value: undefined' errors
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Save or update a book in user's cloud library
 */
export const saveUserBookToCloud = async (userId: string, book: Book): Promise<void> => {
  if (!userId) return;
  const bookRef = doc(db, 'users', userId, 'books', book.id);
  const data = sanitizeForFirestore({
    ...book,
    userId,
    updatedAt: new Date().toISOString()
  });
  await setDoc(bookRef, data, { merge: true });
};

/**
 * Delete a book from user's cloud library
 */
export const deleteUserBookFromCloud = async (userId: string, bookId: string): Promise<void> => {
  if (!userId) return;
  const bookRef = doc(db, 'users', userId, 'books', bookId);
  await deleteDoc(bookRef);
};

/**
 * Subscribe to user's cloud books
 */
export const subscribeToUserBooks = (
  userId: string,
  onUpdate: (books: Book[]) => void
) => {
  if (!userId) return () => {};
  const booksCol = collection(db, 'users', userId, 'books');
  return onSnapshot(booksCol, (snapshot) => {
    const cloudBooks: Book[] = [];
    snapshot.forEach((doc) => {
      cloudBooks.push(doc.data() as Book);
    });
    onUpdate(cloudBooks);
  }, (err) => {
    console.warn('Error subscribing to cloud books:', err);
  });
};

/**
 * Save user reading progress
 */
export const saveReadingProgressToCloud = async (
  userId: string,
  bookId: string,
  chapterId: string,
  chapterIndex: number,
  percentage: number
): Promise<void> => {
  if (!userId || !bookId) return;
  const progressRef = doc(db, 'users', userId, 'progress', bookId);
  const data = sanitizeForFirestore({
    bookId,
    userId,
    currentChapterId: chapterId,
    currentChapterIndex: chapterIndex,
    percentage,
    lastReadAt: new Date().toISOString()
  });
  await setDoc(progressRef, data, { merge: true });
};

/**
 * Save a Bookmark to Firestore
 */
export const saveBookmarkToCloud = async (userId: string, bookmark: BookmarkItem): Promise<void> => {
  if (!userId) return;
  const bmRef = doc(db, 'users', userId, 'bookmarks', bookmark.id);
  const data = sanitizeForFirestore({
    id: bookmark.id,
    bookId: bookmark.bookId,
    chapterId: bookmark.chapterId,
    chapterTitle: bookmark.chapterTitle,
    paragraphIndex: bookmark.paragraphIndex ?? 0,
    snippet: bookmark.snippet || '',
    color: bookmark.color || 'amber',
    note: bookmark.note || '',
    createdAt: bookmark.createdAt || new Date().toISOString(),
    userId
  });
  await setDoc(bmRef, data, { merge: true });
};

/**
 * Delete a Bookmark from Firestore
 */
export const deleteBookmarkFromCloud = async (userId: string, bookmarkId: string): Promise<void> => {
  if (!userId || !bookmarkId) return;
  try {
    const bmRef = doc(db, 'users', userId, 'bookmarks', bookmarkId);
    await deleteDoc(bmRef);
  } catch (err) {
    console.error('Error deleting bookmark document:', err);
  }
};

/**
 * Delete all bookmarks for a specific book from Firestore (resets all bookmarks for that book in DB)
 */
export const clearAllBookmarksForBookFromCloud = async (userId: string, bookId: string): Promise<void> => {
  if (!userId || !bookId) return;
  try {
    const bmColl = collection(db, 'users', userId, 'bookmarks');
    const q = query(bmColl, where('bookId', '==', bookId));
    const snap = await getDocs(q);
    const deletePromises: Promise<void>[] = [];
    snap.forEach((d) => {
      deletePromises.push(deleteDoc(d.ref));
    });
    await Promise.all(deletePromises);
  } catch (err) {
    console.error('Error clearing book bookmarks from Firestore:', err);
  }
};

/**
 * Subscribe to user's bookmarks
 */
export const subscribeToUserBookmarks = (
  userId: string,
  onUpdate: (bookmarks: BookmarkItem[]) => void
) => {
  if (!userId) return () => {};
  const bmCol = collection(db, 'users', userId, 'bookmarks');
  return onSnapshot(bmCol, (snapshot) => {
    const list: BookmarkItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as BookmarkItem);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('Error subscribing to bookmarks:', err);
  });
};

/**
 * Save a Highlight to Firestore
 */
export const saveHighlightToCloud = async (userId: string, highlight: HighlightItem): Promise<void> => {
  if (!userId) return;
  const hlRef = doc(db, 'users', userId, 'highlights', highlight.id);
  const data = sanitizeForFirestore({
    id: highlight.id,
    bookId: highlight.bookId,
    chapterId: highlight.chapterId,
    chapterTitle: highlight.chapterTitle,
    text: highlight.text || '',
    color: highlight.color || 'yellow',
    note: highlight.note || '',
    createdAt: highlight.createdAt || new Date().toISOString(),
    userId
  });
  await setDoc(hlRef, data, { merge: true });
};

/**
 * Delete a Highlight from Firestore
 */
export const deleteHighlightFromCloud = async (userId: string, highlightId: string): Promise<void> => {
  if (!userId) return;
  const hlRef = doc(db, 'users', userId, 'highlights', highlightId);
  await deleteDoc(hlRef);
};

/**
 * Subscribe to user's highlights
 */
export const subscribeToUserHighlights = (
  userId: string,
  onUpdate: (highlights: HighlightItem[]) => void
) => {
  if (!userId) return () => {};
  const hlCol = collection(db, 'users', userId, 'highlights');
  return onSnapshot(hlCol, (snapshot) => {
    const list: HighlightItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as HighlightItem);
    });
    onUpdate(list);
  }, (err) => {
    console.warn('Error subscribing to highlights:', err);
  });
};

/**
 * Save Reader Settings to Firestore
 */
export const saveReaderSettingsToCloud = async (userId: string, settings: ReaderSettings): Promise<void> => {
  if (!userId) return;
  const setRef = doc(db, 'users', userId, 'settings', 'reader');
  const data = sanitizeForFirestore({
    ...settings,
    userId,
    updatedAt: new Date().toISOString()
  });
  await setDoc(setRef, data, { merge: true });
};

/**
 * Load Reader Settings from Firestore
 */
export const getReaderSettingsFromCloud = async (userId: string): Promise<ReaderSettings | null> => {
  if (!userId) return null;
  try {
    const setRef = doc(db, 'users', userId, 'settings', 'reader');
    const snap = await getDoc(setRef);
    if (snap.exists()) {
      return snap.data() as ReaderSettings;
    }
  } catch (e) {
    console.warn('Failed to load cloud settings:', e);
  }
  return null;
};
