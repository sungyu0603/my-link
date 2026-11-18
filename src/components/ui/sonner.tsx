'use client';

import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#111111] group-[.toaster]:border-[#e5e5e5] group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans',
          description: 'group-[.toast]:text-[#707072]',
          actionButton:
            'group-[.toast]:bg-[#111111] group-[.toast]:text-white font-medium',
          cancelButton:
            'group-[.toast]:bg-[#f5f5f5] group-[.toast]:text-[#707072]',
          success: 'group-[.toast]:border-[#007d48]/20 group-[.toast]:text-[#111111]',
          error: 'group-[.toast]:border-red-200 group-[.toast]:text-red-900',
        },
      }}
      position="bottom-center"
      richColors={false}
      closeButton
      {...props}
    />
  );
};

export { Toaster };
