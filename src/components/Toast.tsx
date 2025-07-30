import React from 'react';
import { useToast } from './ToastContext';

type ToastType = 'info' | 'success' | 'error' | 'warning';

const toastTypeStyles: Record<ToastType, string> = {
  info: 'bg-blue-100 border-blue-400 text-blue-800',
  success: 'bg-green-100 border-green-400 text-green-800',
  error: 'bg-red-100 border-red-400 text-red-800',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
};

const toastTypeIcons: Record<ToastType, React.ReactNode> = {
  info: (
    <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
  ),
  success: (
    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
  ),
  error: (
    <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
  ),
  warning: (
    <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01M12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14z" /></svg>
  ),
};

const Toast: React.FC = () => {
  const { toasts } = useToast() || { toasts: [] };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3">
      {toasts && toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative flex items-center min-w-[260px] max-w-xs px-5 py-3 border-l-4 rounded-lg shadow-lg font-medium ${toastTypeStyles[toast.type] || toastTypeStyles.info} animate-fade-in-up`}
        >
          {toastTypeIcons[toast.type] || toastTypeIcons.info}
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;

// Add a modern fade-in-up animation in your global CSS if not present:
// @keyframes fade-in-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
// .animate-fade-in-up { animation: fade-in-up 0.4s cubic-bezier(0.22, 1, 0.36, 1); } 