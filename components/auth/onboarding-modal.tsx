'use client';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth-context';
import { OnboardingForm } from './onboarding-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function OnboardingModal() {
  const { isOnboardingModalOpen, closeOnboardingModal } = useAuth();
  const [isConfirmLeaveOpen, setIsConfirmLeaveOpen] = useState(false);
  const handleSkip = () => setIsConfirmLeaveOpen(true);
  return (
    <>
    <AlertDialog open={isConfirmLeaveOpen} onOpenChange={setIsConfirmLeaveOpen}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-hebrew">לא ניתן להתחבר ללא השלמת הפרטים</AlertDialogTitle>
          <AlertDialogDescription className="font-hebrew">
            כדי להשתמש באתר יש להשלים את תהליך ההרשמה. אם תעזוב כעת תנותק מהמערכת.
            <br />
            האם אתה בטוח שברצונך לעזוב?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel className="font-hebrew">חזור להרשמה</AlertDialogCancel>
          <AlertDialogAction
            className="font-hebrew bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            עזוב והתנתק
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog open={isOnboardingModalOpen} onOpenChange={(open) => { if (!open) handleSkip(); }}>
      <DialogContent
        className="sm:max-w-lg border-black/10 dark:border-white/10 flex flex-col max-h-[90dvh]"
        dir="rtl"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold font-hebrew">
            השלמת הרשמה
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-hebrew">
            ספר לנו קצת על עצמך כדי שנוכל להתאים את התוכן עבורך
          </DialogDescription>
        </DialogHeader>

        <OnboardingForm onComplete={closeOnboardingModal} onSkip={handleSkip} />
      </DialogContent>
    </Dialog>
    </>
  );
}
