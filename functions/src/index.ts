import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

/**
 * incrementLinkClicks
 *
 * 링크 클릭 수를 1 증가시키는 Callable Cloud Function.
 * 클라이언트(브라우저)가 직접 Firestore를 쓰지 않고,
 * 이 함수를 통해 Admin SDK로 클릭 수를 업데이트합니다.
 *
 * 클라이언트 호출 예시:
 *   const fn = httpsCallable(functions, 'incrementLinkClicks');
 *   await fn({ userId: 'abc123', linkId: 'xyz456' });
 */
export const incrementLinkClicks = functions.https.onCall(
  {
    // 한국 사용자 대상이면 'asia-northeast3' (서울) 권장
    region: 'asia-northeast3',
    // 과도한 호출 방지: IP당 분당 최대 60회
    rateLimits: {
      maxConcurrentDispatches: 10,
    },
  },
  async (request) => {
    const { userId, linkId } = request.data as {
      userId?: string;
      linkId?: string;
    };

    // ── 입력값 검증 ──────────────────────────────
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId는 필수 문자열입니다.'
      );
    }

    if (!linkId || typeof linkId !== 'string' || linkId.trim() === '') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'linkId는 필수 문자열입니다.'
      );
    }

    // ── Firestore 경로: users/{userId}/links/{linkId} ─
    const linkRef = db
      .collection('users')
      .doc(userId)
      .collection('links')
      .doc(linkId);

    const snap = await linkRef.get();

    if (!snap.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        '해당 링크 문서가 존재하지 않습니다.'
      );
    }

    // ── Admin SDK로 clicks 필드 원자적 증가 ───────
    await linkRef.update({
      clicks: FieldValue.increment(1),
    });

    return { success: true };
  }
);
