'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextValue {
  isLoginModalOpen: boolean;
  isOnboardingModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const openOnboardingModal = useCallback(() => setIsOnboardingModalOpen(true), []);
  const closeOnboardingModal = useCallback(() => setIsOnboardingModalOpen(false), []);

  // זמני: מושבת עד שיהיה שרת - אונבורדינג לא חובה כרגע
  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user && !session.user.isRegistrationComplete) {
  //     setIsOnboardingModalOpen(true);
  //   }
  // }, [status, session]);

  return (
    <AuthContext.Provider
      value={{
        isLoginModalOpen,
        isOnboardingModalOpen,
        openLoginModal,
        closeLoginModal,
        openOnboardingModal,
        closeOnboardingModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
