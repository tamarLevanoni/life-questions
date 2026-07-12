'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface WhatsAppContextValue {
  isOpen: boolean;
  openWhatsAppModal: () => void;
  closeWhatsAppModal: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsAppModal = useCallback(() => setIsOpen(true), []);
  const closeWhatsAppModal = useCallback(() => setIsOpen(false), []);

  return (
    <WhatsAppContext.Provider value={{ isOpen, openWhatsAppModal, closeWhatsAppModal }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsAppInvite() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsAppInvite must be used within a WhatsAppProvider');
  }
  return context;
}
