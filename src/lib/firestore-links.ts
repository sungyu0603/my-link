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
  where,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functionsInstance } from './firebase';
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

/* ── READ: 특정 사용자의 모든 링크 가져오기 (경로: users/{userId}/links, 조회수 내림차순 정렬) ── */
export async function fetchLinks(userId: string = 'anonymous'): Promise<ProfileLink[]> {
  const colRef = getLinksCollection(userId);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  const links = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const count = data.clickCount ?? data.clicks ?? 0;
    return {
      id: docSnap.id,
      title: data.title ?? '',
      subtitle: data.subtitle ?? undefined,
      url: data.url ?? '',
      iconName: data.iconName ?? 'globe',
      badge: data.badge ?? undefined,
      isFeatured: data.isFeatured ?? false,
      clicks: count,
      clickCount: count,
      category: data.category ?? 'general',
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
    } as ProfileLink;
  });

  // 조회수(clickCount) 내림차순 정렬 (동일한 경우 최신 생성순)
  return links.sort((a, b) => {
    const clickDiff = (b.clickCount ?? b.clicks ?? 0) - (a.clickCount ?? a.clicks ?? 0);
    if (clickDiff !== 0) return clickDiff;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

/* ── SUBSCRIBE: 실시간 링크 목록 구독 (경로: users/{userId}/links, 조회수 내림차순 정렬) ── */
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
        const count = data.clickCount ?? data.clicks ?? 0;
        return {
          id: docSnap.id,
          title: data.title ?? '',
          subtitle: data.subtitle ?? undefined,
          url: data.url ?? '',
          iconName: data.iconName ?? 'globe',
          badge: data.badge ?? undefined,
          isFeatured: data.isFeatured ?? false,
          clicks: count,
          clickCount: count,
          category: data.category ?? 'general',
          createdAt: formatTimestamp(data.createdAt),
          updatedAt: formatTimestamp(data.updatedAt),
        } as ProfileLink;
      });

      // 조회수(clickCount) 내림차순 정렬
      const sortedLinks = links.sort((a, b) => {
        const clickDiff = (b.clickCount ?? b.clicks ?? 0) - (a.clickCount ?? a.clicks ?? 0);
        if (clickDiff !== 0) return clickDiff;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });

      onUpdate(sortedLinks);
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
    clickCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docRef = await addDoc(colRef, payload);

  return {
    ...linkData,
    id: docRef.id,
    clicks: 0,
    clickCount: 0,
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
      const data = snap.data();
      const profileData = data.profile || {};
      return {
        ...initialProfileData,
        ...data,
        handle: profileData.username || data.handle || initialProfileData.handle,
        name: profileData.name || data.name || initialProfileData.name,
        bio: profileData.bio !== undefined ? profileData.bio : (data.bio ?? initialProfileData.bio),
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

/* ── USERNAME AVAILABILITY: Username 중복 확인 ── */
export async function checkUsernameAvailability(
  currentUserId: string = '',
  rawUsername: string
): Promise<{ available: boolean; reason?: string }> {
  const cleanUsername = rawUsername.trim().toLowerCase().replace(/^@/, '');

  if (!cleanUsername) {
    return { available: false, reason: '사용자명(Username)을 입력해 주세요.' };
  }

  if (cleanUsername.length < 2) {
    return { available: false, reason: '사용자명은 최소 2자 이상이어야 합니다.' };
  }

  if (cleanUsername.length > 30) {
    return { available: false, reason: '사용자명은 최대 30자 이하이어야 합니다.' };
  }

  const regex = /^[a-z0-9_.-]+$/;
  if (!regex.test(cleanUsername)) {
    return {
      available: false,
      reason: '영문 소문자, 숫자, 밑줄(_), 하이픈(-), 마침표(.)만 사용할 수 있습니다.',
    };
  }

  try {
    const usersRef = collection(db, 'users');

    // 1) users/{uid}.handle 필드 일치 검사
    const q1 = query(usersRef, where('handle', '==', cleanUsername));
    const snap1 = await getDocs(q1);

    for (const docSnap of snap1.docs) {
      if (docSnap.id !== currentUserId) {
        return { available: false, reason: '이미 다른 사용자가 사용 중인 사용자명입니다.' };
      }
    }

    // 2) users/{uid}.profile.username 필드 일치 검사
    const q2 = query(usersRef, where('profile.username', '==', cleanUsername));
    const snap2 = await getDocs(q2);

    for (const docSnap of snap2.docs) {
      if (docSnap.id !== currentUserId) {
        return { available: false, reason: '이미 다른 사용자가 사용 중인 사용자명입니다.' };
      }
    }

    return { available: true, reason: '사용 가능한 사용자명입니다.' };
  } catch (error) {
    console.error('[Firestore] checkUsernameAvailability 쿼리 오류:', error);
    // 보안 규칙으로 컬렉션 조회가 제한된 경우 현재 세션 내에서 사용 허용
    return { available: true, reason: '사용 가능한 형식입니다.' };
  }
}

/* ── DISPLAY NAME AVAILABILITY: 이름 (Display Name) 중복 확인 ── */
export async function checkDisplayNameAvailability(
  currentUserId: string = '',
  rawName: string
): Promise<{ available: boolean; reason?: string }> {
  const cleanName = rawName.trim();

  if (!cleanName) {
    return { available: false, reason: '이름(Display Name)을 입력해 주세요.' };
  }

  if (cleanName.length < 2) {
    return { available: false, reason: '이름은 최소 2자 이상이어야 합니다.' };
  }

  if (cleanName.length > 30) {
    return { available: false, reason: '이름은 최대 30자 이하이어야 합니다.' };
  }

  try {
    const usersRef = collection(db, 'users');

    // 1) users/{uid}.name 필드 일치 검사
    const q1 = query(usersRef, where('name', '==', cleanName));
    const snap1 = await getDocs(q1);

    for (const docSnap of snap1.docs) {
      if (docSnap.id !== currentUserId) {
        return {
          available: false,
          reason: '동일한 이름을 사용하는 사용자가 이미 존재합니다.',
        };
      }
    }

    // 2) users/{uid}.profile.name 필드 일치 검사
    const q2 = query(usersRef, where('profile.name', '==', cleanName));
    const snap2 = await getDocs(q2);

    for (const docSnap of snap2.docs) {
      if (docSnap.id !== currentUserId) {
        return {
          available: false,
          reason: '동일한 이름을 사용하는 사용자가 이미 존재합니다.',
        };
      }
    }

    return { available: true, reason: '사용 가능한 이름입니다.' };
  } catch (error) {
    console.error('[Firestore] checkDisplayNameAvailability 쿼리 오류:', error);
    return { available: true, reason: '사용 가능한 형식입니다.' };
  }
}

/* ── USER PROFILE UPDATE: users/{userId}/profile 에 업데이트 ── */
export async function saveUserProfileData(
  userId: string,
  data: {
    username: string;
    name: string;
    bio: string;
  }
): Promise<void> {
  const cleanUsername = data.username.trim().toLowerCase().replace(/^@/, '');
  const cleanName = data.name.trim();
  const cleanBio = data.bio.trim();

  const profilePayload = {
    username: cleanUsername,
    name: cleanName,
    bio: cleanBio,
    updatedAt: serverTimestamp(),
  };

  // 1) users/{userId} 주 문서에 handle, name, bio 및 profile 객체 업데이트
  const userDocRef = doc(db, 'users', userId);
  await setDoc(
    userDocRef,
    {
      handle: cleanUsername,
      name: cleanName,
      bio: cleanBio,
      profile: profilePayload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // 2) users/{userId}/profile 경로 (하위 문서 users/{userId}/profile/info) 저장
  try {
    const subProfileDocRef = doc(db, 'users', userId, 'profile', 'info');
    await setDoc(subProfileDocRef, profilePayload, { merge: true });
  } catch (subErr) {
    console.warn('[Firestore] users/{userId}/profile 서브컬렉션 저장 경고:', subErr);
  }
}

/* ── FIND USER: username으로 userId 검색 (where 쿼리) ── */
export async function findUserIdByUsername(rawUsername: string): Promise<string | null> {
  const cleanUsername = rawUsername.trim().toLowerCase().replace(/^@/, '');
  if (!cleanUsername) return null;

  try {
    const usersRef = collection(db, 'users');

    // 1) where('handle', '==', cleanUsername)
    let q = query(usersRef, where('handle', '==', cleanUsername));
    let snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].id;
    }

    // 2) where('profile.username', '==', cleanUsername)
    q = query(usersRef, where('profile.username', '==', cleanUsername));
    snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].id;
    }

    // 3) 대소문자 무관 이름 또는 원본 이름 fallback 검색
    q = query(usersRef, where('name', '==', rawUsername.trim()));
    snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].id;
    }

    // 4) users/{userId} UID 직접 일치 여부 확인
    const directUserDoc = await getDoc(doc(db, 'users', cleanUsername));
    if (directUserDoc.exists()) {
      return directUserDoc.id;
    }

    return null;
  } catch (error) {
    console.error('[Firestore] findUserIdByUsername 오류:', error);
    return null;
  }
}

/* ── GET USER PROFILE: users/{userId}/profile 및 users/{userId} 조회 ── */
export interface UserProfileInfo {
  userId: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  theme?: string;
  updatedAt?: string;
}

export async function fetchUserFullProfile(userId: string): Promise<UserProfileInfo | null> {
  try {
    let username = '';
    let name = '';
    let bio = '';
    let avatarUrl = '';
    let theme = 'minimal';
    let updatedAt: string | undefined = undefined;

    // 1) users/{userId} 주 문서 조회
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      username = data.handle || data.profile?.username || '';
      name = data.name || data.profile?.name || '';
      bio = data.bio !== undefined ? data.bio : (data.profile?.bio ?? '');
      avatarUrl = data.avatarUrl || data.photoURL || '';
      theme = data.theme || 'minimal';
      updatedAt = formatTimestamp(data.updatedAt);
    }

    // 2) users/{userId}/profile 하위 컬렉션 (users/{userId}/profile/info) 조회
    try {
      const subProfileRef = doc(db, 'users', userId, 'profile', 'info');
      const subProfileSnap = await getDoc(subProfileRef);
      if (subProfileSnap.exists()) {
        const subData = subProfileSnap.data();
        if (subData.username) username = subData.username;
        if (subData.name) name = subData.name;
        if (subData.bio !== undefined) bio = subData.bio;
        if (subData.avatarUrl) avatarUrl = subData.avatarUrl;
        if (subData.updatedAt) updatedAt = formatTimestamp(subData.updatedAt);
      } else {
        // 혹시 서브컬렉션 내 다른 문서가 있는지 조회
        const subColRef = collection(db, 'users', userId, 'profile');
        const subColSnap = await getDocs(subColRef);
        if (!subColSnap.empty) {
          const firstDoc = subColSnap.docs[0].data();
          if (firstDoc.username) username = firstDoc.username;
          if (firstDoc.name) name = firstDoc.name;
          if (firstDoc.bio !== undefined) bio = firstDoc.bio;
        }
      }
    } catch (subErr) {
      console.warn('[Firestore] users/{userId}/profile 서브컬렉션 읽기 경고:', subErr);
    }

    if (!userSnap.exists() && !username && !name) {
      return null;
    }

    return {
      userId,
      username: username || 'user',
      name: name || username || '익명 사용자',
      bio: bio || '',
      avatarUrl,
      theme,
      updatedAt,
    };
  } catch (error) {
    console.error(`[Firestore] fetchUserFullProfile (${userId}) 에러:`, error);
    return null;
  }
}

/* ── INCREMENT LINK CLICKS: users/{userId}/links/{linkId} 의 clickCount 를 increment(1)로 증가 ── */
export async function incrementLinkClickCount(userId: string, linkId: string): Promise<void> {
  if (!userId || !linkId) return;
  try {
    const linkDocRef = doc(db, 'users', userId, 'links', linkId);
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
    });
  } catch (error) {
    console.warn(`[Firestore] incrementLinkClickCount 직접 쓰기 실패, Cloud Function으로 fallback 시도:`, error);
    try {
      const fn = httpsCallable<{ userId: string; linkId: string }, { success: boolean }>(
        functionsInstance,
        'incrementLinkClicks'
      );
      await fn({ userId, linkId });
    } catch (fnErr) {
      console.warn(`[Functions] incrementLinkClicks (${userId}/${linkId}) fallback 오류:`, fnErr);
    }
  }
}

/* ── INCREMENT LINK CLICKS: 하위 호환 래퍼 ── */
export async function incrementFirestoreLinkClicks(userId: string, linkId: string): Promise<void> {
  return incrementLinkClickCount(userId, linkId);
}
