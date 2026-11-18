import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from '@/types/profile';
import { initialProfileData } from '@/data/initialProfile';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface AuthUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Firebase User 객체에서 필요한 직렬화 가능한 정보만 추출
 */
export function extractAuthUser(user: User | null): AuthUserInfo | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Firebase Auth 에러 코드를 친절한 한국어 안내 메시지로 변환
 */
export function getFirebaseAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Firebase Console에서 Google 로그인이 활성화되지 않았습니다. [Authentication > Sign-in method]에서 Google을 사용 설정해주세요.';
    case 'auth/unauthorized-domain':
      return '현재 도메인(localhost 등)이 Firebase 승인된 도메인에 등록되어 있지 않습니다. [Authentication > Settings > Authorized domains]에 추가해주세요.';
    case 'auth/popup-blocked':
      return '브라우저 팝업이 차단되었습니다. 브라우저 주소창에서 팝업 차단을 해제하고 다시 시도해주세요.';
    case 'auth/popup-closed-by-user':
      return '로그인 팝업 창이 닫혔습니다.';
    case 'auth/cancelled-popup-request':
      return '이전 로그인 요청이 아직 진행 중입니다.';
    case 'auth/network-request-failed':
      return '네트워크 연결 오류가 발생했습니다. 인터넷 연결 상태를 확인해주세요.';
    case 'auth/invalid-api-key':
      return 'Firebase API Key가 유효하지 않습니다. .env.local 설정을 확인해주세요.';
    default:
      return error?.message
        ? `로그인 오류 (${code || 'unknown'}): ${error.message}`
        : '구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}

/**
 * Google 팝업 소셜 로그인
 */
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * 로그아웃
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Firebase Auth 상태 감지 리스너 (onAuthStateChanged)
 */
export function subscribeAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * 로그인 시 users/{uid} 문서와 동기화 (기존 문서가 없으면 초기 프로필 생성)
 * Firestore 보안 규칙으로 인해 실패하더라도 로그인이 튕기지 않도록 try-catch 처리
 */
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const fallbackProfile: UserProfile = {
    ...initialProfileData,
    name: user.displayName || '김선규',
    handle: user.email ? user.email.split('@')[0] : 'user',
    avatarUrl: user.photoURL || initialProfileData.avatarUrl,
    bio: `${user.displayName || '김선규'}님의 개인화된 마이링크 공간입니다.`,
  };

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        ...initialProfileData,
        ...data,
        name: data.name || user.displayName || '김선규',
        avatarUrl: data.avatarUrl || user.photoURL || initialProfileData.avatarUrl,
      } as UserProfile;
    }

    await setDoc(userDocRef, {
      ...fallbackProfile,
      email: user.email,
      uid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return fallbackProfile;
  } catch (error) {
    console.warn('[syncUserProfile] Firestore users 문서 저장 경고 (보안 규칙 확인 필요):', error);
    // Firestore 쓰기 권한이 없더라도 Auth 정보 기반 기본 프로필 반환
    return fallbackProfile;
  }
}
