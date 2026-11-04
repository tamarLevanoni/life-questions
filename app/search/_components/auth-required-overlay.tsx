'use client';

import { LogIn } from 'lucide-react';

interface AuthRequiredOverlayProps {
  onClick: () => void;
}

export function AuthRequiredOverlay({ onClick }: AuthRequiredOverlayProps) {
  return (
    <button
      type="button"
      aria-label="יש להתחבר כדי לחפש"
      className="absolute inset-0 z-10 backdrop-blur-[1px] bg-background/20 rounded-xl cursor-pointer w-full flex items-start justify-center pt-16"
      onClick={onClick}
    >
      <div className="glass-card px-6 py-4 rounded-xl text-center pointer-events-none">
        <LogIn className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-hebrew text-muted-foreground">יש להתחבר כדי לחפש</p>
      </div>
    </button>
  );
}
