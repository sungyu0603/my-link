import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ProfileLink } from '@/types/profile';

/**
 * Firestore 컬렉션 경로: users/anonymous/links
 */
const linksCollectionRef = collection(db, 'users', 'anonymous', 'links');

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

/* ── READ: 모든 링크 가져오기 (createdAt 최신순) ── */
export async function fetchLinks(): Promise<ProfileLink[]> {
  const q = query(linksCollectionRef, orderBy('createdAt', 'desc'));
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
    } as ProfileLink;
  });
}

/* ── SUBSCRIBE: 실시간 링크 목록 구독 (경로: users/anonymous/links, createdAt 최신순) ── */
export function subscribeLinks(
  onUpdate: (links: ProfileLink[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(linksCollectionRef, orderBy('createdAt', 'desc'));
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
        } as ProfileLink;
      });
      onUpdate(links);
    },
    (error) => {
      console.error('[Firestore] subscribeLinks 오류:', error);
      onError?.(error);
    }
  );
}

/* ── CREATE: 새 링크 추가 ── */
export async function createLink(
  linkData: Omit<ProfileLink, 'id' | 'clicks'>
): Promise<ProfileLink> {
  const payload = removeUndefinedFields({
    ...linkData,
    clicks: 0,
    createdAt: serverTimestamp(),
  });

  const docRef = await addDoc(linksCollectionRef, payload);

  return {
    ...linkData,
    id: docRef.id,
    clicks: 0,
  };
}

/* ── UPDATE: 링크 수정 ── */
export async function updateLinkDoc(
  id: string,
  updated: Partial<ProfileLink>
): Promise<void> {
  const docRef = doc(db, 'users', 'anonymous', 'links', id);
  // id는 문서 키이므로 필드에서 제거
  const { id: _id, ...rest } = updated;
  const payload = removeUndefinedFields({
    ...rest,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(docRef, payload);
}

/* ── DELETE: 링크 삭제 ── */
export async function deleteLinkDoc(id: string): Promise<void> {
  const docRef = doc(db, 'users', 'anonymous', 'links', id);
  await deleteDoc(docRef);
}
