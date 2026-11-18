'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  AtSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Save,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { useUpdateProfileMutation } from '@/hooks/useProfileQuery';
import {
  checkUsernameAvailability,
  checkDisplayNameAvailability,
} from '@/lib/firestore-links';

interface EditProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'duplicate' | 'invalid';

const MAX_BIO_LENGTH = 150;

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = (next: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(next);
    } else {
      setInternalOpen(next);
    }
  };

  const { authUser, profile } = useMyLinkStore();
  const updateProfileMutation = useUpdateProfileMutation(authUser?.uid);

  // 폼 입력 상태
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  // Username 중복 확인 상태
  const [usernameStatus, setUsernameStatus] = useState<CheckStatus>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  // 이름 (Display Name) 중복 확인 상태
  const [nameStatus, setNameStatus] = useState<CheckStatus>('idle');
  const [nameMessage, setNameMessage] = useState('');

  const isSubmitting = updateProfileMutation.isPending;

  // 현재 프로필 기준값 (공백 정규화)
  const currentHandle = (profile.handle || (authUser?.email ? authUser.email.split('@')[0] : 'user'))
    .trim()
    .toLowerCase()
    .replace(/^@/, '');
  const currentName = (profile.name || authUser?.displayName || '김선규').trim();
  const currentBio = (profile.bio || '').trim();

  // 현재 입력값 (공백 정규화)
  const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
  const cleanName = name.trim();
  const cleanBio = bio.trim();

  // 변경 사항 존재 여부 확인
  const isChanged =
    cleanUsername !== currentHandle ||
    cleanName !== currentName ||
    cleanBio !== currentBio;

  // 다이얼로그 열릴 때 기존 프로필 정보로 초기화
  useEffect(() => {
    if (isOpen) {
      const currentHandle = profile.handle || (authUser?.email ? authUser.email.split('@')[0] : 'user');
      const currentName = profile.name || authUser?.displayName || '김선규';
      const currentBio = profile.bio || '';

      setUsername(currentHandle);
      setName(currentName);
      setBio(currentBio);

      setUsernameStatus('available');
      setUsernameMessage('현재 회원님의 사용자명입니다.');

      setNameStatus('available');
      setNameMessage('현재 회원님의 이름입니다.');
    }
  }, [isOpen, profile, authUser]);

  // Username 입력 변경 핸들러
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, '').toLowerCase();
    setUsername(val);

    const clean = val.replace(/^@/, '');
    const currentHandle = (profile.handle || '').toLowerCase().replace(/^@/, '');

    if (clean === currentHandle && clean.length > 0) {
      setUsernameStatus('available');
      setUsernameMessage('현재 회원님의 사용자명입니다.');
    } else {
      setUsernameStatus('idle');
      setUsernameMessage('');
    }
  };

  // 이름 (Display Name) 입력 변경 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);

    const clean = val.trim();
    const currentName = (profile.name || '').trim();

    if (clean === currentName && clean.length > 0) {
      setNameStatus('available');
      setNameMessage('현재 회원님의 이름입니다.');
    } else {
      setNameStatus('idle');
      setNameMessage('');
    }
  };

  // Username 중복 확인 수행
  const handleCheckUsername = async () => {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    const currentHandle = (profile.handle || '').toLowerCase().replace(/^@/, '');

    if (!clean) {
      setUsernameStatus('invalid');
      setUsernameMessage('사용자명을 입력해 주세요.');
      return;
    }

    if (clean === currentHandle) {
      setUsernameStatus('available');
      setUsernameMessage('현재 회원님의 사용자명입니다.');
      return;
    }

    setUsernameStatus('checking');
    setUsernameMessage('중복 확인 중...');

    try {
      const res = await checkUsernameAvailability(authUser?.uid || '', clean);
      if (res.available) {
        setUsernameStatus('available');
        setUsernameMessage(res.reason || '사용 가능한 사용자명입니다.');
      } else {
        setUsernameStatus('duplicate');
        setUsernameMessage(res.reason || '이미 사용 중인 사용자명입니다.');
      }
    } catch {
      setUsernameStatus('invalid');
      setUsernameMessage('확인 중 오류가 발생했습니다.');
    }
  };

  // 이름 (Display Name) 중복 확인 수행
  const handleCheckDisplayName = async () => {
    const clean = name.trim();
    const currentName = (profile.name || '').trim();

    if (!clean) {
      setNameStatus('invalid');
      setNameMessage('이름을 입력해 주세요.');
      return;
    }

    if (clean === currentName) {
      setNameStatus('available');
      setNameMessage('현재 회원님의 이름입니다.');
      return;
    }

    setNameStatus('checking');
    setNameMessage('중복 확인 중...');

    try {
      const res = await checkDisplayNameAvailability(authUser?.uid || '', clean);
      if (res.available) {
        setNameStatus('available');
        setNameMessage(res.reason || '사용 가능한 이름입니다.');
      } else {
        setNameStatus('duplicate');
        setNameMessage(res.reason || '동일한 이름을 사용하는 계정이 있습니다.');
      }
    } catch {
      setNameStatus('invalid');
      setNameMessage('확인 중 오류가 발생했습니다.');
    }
  };

  // 프로필 저장 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 변경된 사항이 없으면 Firestore 업데이트를 수행하지 않고 안내 후 종료
    if (!isChanged) {
      toast.info('변경된 사항이 없습니다.');
      setIsOpen(false);
      return;
    }

    if (!cleanUsername) {
      toast.error('사용자명(Username)을 입력해 주세요.');
      return;
    }

    if (!cleanName) {
      toast.error('이름(Display Name)을 입력해 주세요.');
      return;
    }

    // Username 중복 확인 체크
    if (cleanUsername !== currentHandle && usernameStatus !== 'available') {
      toast.warning('사용자명 중복 확인을 먼저 완료해 주세요.');
      return;
    }

    try {
      // TanStack Query 낙관적 업데이트 Mutation 실행
      await updateProfileMutation.mutateAsync({
        username: cleanUsername,
        name: cleanName,
        bio: cleanBio,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('[EditProfileDialog] 프로필 저장 에러:', error);
      // 에러 토스트는 mutation.onError에서 자동 롤백 및 처리됨
    }
  };

  const defaultTrigger = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="rounded-full border-[#e5e5e5] hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-all text-xs font-medium px-3 h-8 flex items-center gap-1.5 shadow-none cursor-pointer"
    >
      <Pencil className="w-3.5 h-3.5" />
      <span>프로필 수정</span>
    </Button>
  );

  return (
    <>
      {trigger !== undefined ? (
        React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
              (trigger as any).props?.onClick?.(e);
              setIsOpen(true);
            },
          })
        ) : (
          <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-flex">
            {trigger}
          </span>
        )
      ) : (
        !isControlled && defaultTrigger
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] p-0 overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#fafafa] to-white border-b border-[#f0f0f0]">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#111111] text-white">
                <User className="w-4 h-4" />
              </span>
              <DialogTitle className="text-base sm:text-lg font-bold text-[#111111]">
                프로필 수정
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-[#707072]">
              마이페이지에 노출되는 사용자명, 이름, 소개글을 업데이트합니다.
            </DialogDescription>
          </DialogHeader>

          {/* 실시간 미리보기 카드 */}
          <div className="mt-4 p-3 rounded-2xl bg-white border border-[#e5e5e5]/80 shadow-xs flex items-center gap-3">
            <Avatar className="size-11 border border-[#111111]/15 shrink-0">
              <AvatarImage
                src={authUser?.photoURL || profile.avatarUrl}
                alt={name || profile.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#111111] text-white font-bold text-xs">
                {(name || profile.name || 'ML').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                  {name || '이름을 입력하세요'}
                </span>
                <span className="text-[11px] font-medium text-[#707072] truncate">
                  @{username.replace(/^@/, '') || 'username'}
                </span>
              </div>
              <p className="text-[11px] text-[#707072] line-clamp-1">
                {bio || '소개글이 비어 있습니다.'}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-[9px] px-2 py-0.5 rounded-full shrink-0 font-medium transition-colors ${
                isChanged
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-[#e5e5e5] text-[#707072] bg-[#fafafa]'
              }`}
            >
              {isChanged ? '수정 중' : '변경사항 없음'}
            </Badge>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          {/* 1. Username Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-username"
                className="text-xs font-semibold text-[#111111] flex items-center gap-1"
              >
                <AtSign className="w-3.5 h-3.5 text-[#707072]" />
                <span>Username (사용자 아이디)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#9e9ea0]">
                영문 소문자, 숫자, 밑줄, 마침표 (2~30자)
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9e9ea0] pointer-events-none">
                  @
                </span>
                <Input
                  id="profile-username"
                  type="text"
                  value={username.replace(/^@/, '')}
                  onChange={handleUsernameChange}
                  placeholder="username"
                  maxLength={30}
                  className="pl-7 pr-3 h-10 rounded-xl text-xs sm:text-sm border-[#e5e5e5] focus-visible:border-[#111111] focus-visible:ring-0"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckUsername}
                disabled={
                  usernameStatus === 'checking' ||
                  !username.trim() ||
                  usernameStatus === 'available'
                }
                className="h-10 px-3.5 rounded-xl border-[#e5e5e5] text-xs font-medium hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                {usernameStatus === 'checking' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : usernameStatus === 'available' ? (
                  <span className="text-[#007d48] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 확인완료
                  </span>
                ) : (
                  '중복 확인'
                )}
              </Button>
            </div>

            {/* Username 피드백 메시지 */}
            {usernameMessage && (
              <div
                className={`flex items-center gap-1 text-[11px] font-medium pt-0.5 ${
                  usernameStatus === 'available'
                    ? 'text-[#007d48]'
                    : usernameStatus === 'duplicate' || usernameStatus === 'invalid'
                    ? 'text-red-600'
                    : 'text-[#707072]'
                }`}
              >
                {usernameStatus === 'available' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : usernameStatus === 'duplicate' || usernameStatus === 'invalid' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : null}
                <span>{usernameMessage}</span>
              </div>
            )}
          </div>

          {/* 2. 이름 (Display Name) Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-name"
                className="text-xs font-semibold text-[#111111] flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5 text-[#707072]" />
                <span>이름 (Display Name)</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#9e9ea0]">
                화면에 표시되는 활동명
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="예: 김선규"
                maxLength={30}
                className="flex-1 h-10 rounded-xl text-xs sm:text-sm border-[#e5e5e5] focus-visible:border-[#111111] focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckDisplayName}
                disabled={
                  nameStatus === 'checking' ||
                  !name.trim() ||
                  nameStatus === 'available'
                }
                className="h-10 px-3.5 rounded-xl border-[#e5e5e5] text-xs font-medium hover:border-[#111111] hover:bg-[#111111] hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Display Name 중복 확인"
              >
                {nameStatus === 'checking' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : nameStatus === 'available' ? (
                  <span className="text-[#007d48] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 확인완료
                  </span>
                ) : (
                  '중복 확인'
                )}
              </Button>
            </div>

            {/* Display Name 피드백 메시지 */}
            {nameMessage && (
              <div
                className={`flex items-center gap-1 text-[11px] font-medium pt-0.5 ${
                  nameStatus === 'available'
                    ? 'text-[#007d48]'
                    : nameStatus === 'duplicate' || nameStatus === 'invalid'
                    ? 'text-amber-600'
                    : 'text-[#707072]'
                }`}
              >
                {nameStatus === 'available' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : nameStatus === 'duplicate' || nameStatus === 'invalid' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : null}
                <span>{nameMessage}</span>
              </div>
            )}
          </div>

          {/* 3. 소개글 (Bio) Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-bio"
                className="text-xs font-semibold text-[#111111] flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-[#707072]" />
                <span>소개글 (Bio)</span>
              </label>
              <span
                className={`text-[10px] ${
                  bio.length >= MAX_BIO_LENGTH ? 'text-red-500 font-bold' : 'text-[#9e9ea0]'
                }`}
              >
                {bio.length} / {MAX_BIO_LENGTH}자
              </span>
            </div>

            <Textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
              placeholder="나를 소개하는 한 줄을 작성해 보세요. (관심 분야, 포지션, 목표 등)"
              rows={3}
              className="text-xs sm:text-sm border-[#e5e5e5] focus-visible:border-[#111111] focus-visible:ring-0 leading-relaxed rounded-xl"
            />
          </div>

          {/* Actions Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#f0f0f0]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl border-[#e5e5e5] text-xs h-10 px-4 hover:bg-[#f5f5f5] cursor-pointer"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !isChanged ||
                (cleanUsername !== currentHandle && usernameStatus !== 'available')
              }
              title={!isChanged ? '변경된 내용이 없습니다.' : undefined}
              className="rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs h-10 px-5 flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isChanged ? '변경사항 저장' : '변경사항 없음'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
