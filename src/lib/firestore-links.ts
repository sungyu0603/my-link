import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ProfileLink, UserProfile } from '@/types/profile';
import { initialProfileData } from '@/data/initialProfile';

/**
 * 사용자별 링크 컬렉션 참조 반환: users/{userId}/links
 */
export function getLinksCollection(userId: string = 'anonymous') {
  return collection(db, 'users', userId, 'links');
}

/**
 * Firestore는 undefined 필드를 허용하지 않으므로 제거하는 유틸리티
 */
function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Firestore Timestamp 또는 Date 객체를 ISO 문자열로 안전하게 변환
 */
export function formatTimestamp(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }
  return undefined;
}

/* ── READ: 특정 사용자의 모든 링크 가져오기 (경로: users/{userId}/links, createdAt 최신순) ── */
export async function fetchLinks(userId: string = 'anonymous'): Promise<ProfileLink[]> {
  const colRef = getLinksCollection(userId);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? '',
      subtitle: data.subtitle ?? undefined,
      url: data.url ?? '',
      iconName: data.iconName ?? 'globe',
      badge: data.badge ?? undefined,
      isFeatured: data.isFeatured ?? false,
      clicks: data.clicks ?? 0,
      category: data.category ?? 'general',
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
    } as ProfileLink;
  });
}

/* ── SUBSCRIBE: 실시간 링크 목록 구독 (경로: users/{userId}/links, createdAt 최신순) ── */
export function subscribeLinks(
  userId: string = 'anonymous',
  onUpdate: (links: ProfileLink[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = getLinksCollection(userId);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const links = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title ?? '',
          subtitle: data.subtitle ?? undefined,
          url: data.url ?? '',
          iconName: data.iconName ?? 'globe',
          badge: data.badge ?? undefined,
          isFeatured: data.isFeatured ?? false,
          clicks: data.clicks ?? 0,
          category: data.category ?? 'general',
          createdAt: formatTimestamp(data.createdAt),
          updatedAt: formatTimestamp(data.updatedAt),
        } as ProfileLink;
      });
      onUpdate(links);
    },
    (error) => {
      console.error(`[Firestore] subscribeLinks (${userId}) 오류:`, error);
      onError?.(error);
    }
  );
}

/* ── CREATE: 새 링크 추가 (경로: users/{userId}/links) ── */
export async function createLink(
  userId: string = 'anonymous',
  linkData: Omit<ProfileLink, 'id' | 'clicks' | 'createdAt' | 'updatedAt'>
): Promise<ProfileLink> {
  const colRef = getLinksCollection(userId);
  const payload = removeUndefinedFields({
    ...linkData,
    clicks: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docRef = await addDoc(colRef, payload);

  return {
    ...linkData,
    id: docRef.id,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/* ── UPDATE: 링크 수정 (경로: users/{userId}/links/{id}) ── */
export async function updateLinkDoc(
  userId: string = 'anonymous',
  id: string,
  updated: Partial<ProfileLink>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'links', id);
  const { id: _id, ...rest } = updated;
  const payload = removeUndefinedFields({
    ...rest,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(docRef, payload);
}

/* ── DELETE: 링크 삭제 (경로: users/{userId}/links/{id}) ── */
export async function deleteLinkDoc(userId: string = 'anonymous', id: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'links', id);
  await deleteDoc(docRef);
}

/* ── USER PROFILE: users/{userId} 사용자 정보 가져오기 ── */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return {
        ...initialProfileData,
        ...snap.data(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error(`[Firestore] fetchUserProfile (${userId}) 오류:`, error);
    return null;
  }
}

/* ── USER PROFILE: users/{userId} 사용자 정보 저장/수정 ── */
export async function saveUserProfile(
  userId: string,
  profile: Partial<UserProfile>
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const payload = removeUndefinedFields({
    ...profile,
    updatedAt: serverTimestamp(),
  });
  await setDoc(userDocRef, payload, { merge: true });
}
