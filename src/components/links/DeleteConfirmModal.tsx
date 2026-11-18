'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkTitle: string;
  onConfirm: () => Promise<void> | void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onOpenChange,
  linkTitle,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('[DeleteConfirmModal] 삭제 실패:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isDeleting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[#e5e5e5]">
          <DialogHeader className="pr-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#fff0f0] text-[#d30005] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-[#111111]">
                정말 삭제하시겠습니까?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-[#707072] mt-1.5">
              선택한 링크가 마이링크 프로필 및 데이터베이스에서 영구적으로 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3.5 bg-white">
          {/* 링크 이름 표시 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#707072] uppercase tracking-wider">
              삭제 대상 링크
            </span>
            <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] text-xs sm:text-sm font-bold text-[#111111] break-words">
              {linkTitle || '선택된 링크'}
            </div>
          </div>

          {/* 경고 문구: 이 작업은 되돌릴 수 없습니다 (빨간색) */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fff5f5] border border-[#ffe0e0]">
            <AlertTriangle className="w-4 h-4 text-[#d30005] shrink-0" />
            <p className="text-xs font-bold text-[#d30005]">
              이 작업은 되돌릴 수 없습니다
            </p>
          </div>
        </div>

        {/* Action Buttons: [취소] [삭제하기] */}
        <div className="p-4 bg-[#fafafa] border-t border-[#e5e5e5] flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-full border-[#e5e5e5] bg-white hover:bg-[#f5f5f5] text-xs font-semibold text-[#707072] hover:text-[#111111] cursor-pointer active:scale-[0.97] transition-all disabled:opacity-50"
          >
            취소
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-10 px-5 rounded-full bg-[#d30005] hover:bg-[#b00004] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>삭제 중...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
