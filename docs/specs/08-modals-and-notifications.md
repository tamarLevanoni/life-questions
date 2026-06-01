# Modals And Notifications Spec

## Goal
Define when to use modals, toasts, alert dialogs, and sheets, and how global interactions are opened and closed.

---

## Principle

| Situation | UI | Reason |
|-----------|----|--------|
| User must act before continuing | **Modal** | Blocking action; cannot be ignored |
| Result or transient message | **Toast** | Confirmation, non-blocking error, info |
| Small confirm/alert | **AlertDialog** (Shadcn) | Delete confirmation, cancel confirmation |
| Non-blocking side content | **Sheet** (Shadcn) | Mobile filters, settings panel |

---

## Global Modals

Global modals are mounted once in [app/providers.tsx](../../app/providers.tsx), nowhere else.

### `<LoginModal>`
Purpose: start Google sign-in.
- Open state lives in `AuthContext.isLoginModalOpen`.
- Opening: `useAuth().openLoginModal()` from any client component that needs login.
- Closing: manual close or automatic redirect into Google.
- RSC never opens this modal directly.

### `<OnboardingModal>`
Purpose: complete user registration after first OAuth login.
- Open state lives in `AuthContext.isOnboardingModalOpen`.
- Opens automatically from `AuthProvider` when `session?.user?.isRegistrationComplete === false`.
- Cannot be dismissed until the user submits a valid form. `closeOnboardingModal` runs only after successful submit.

### Adding A New Global Modal
1. Add UI component in `components/<feature>/<name>-modal.tsx`.
2. Add state to `AuthContext`, or to a dedicated UI store when there are three or more global modals.
3. Mount once in `<Providers>`.
4. Do not mount/open global modals inside pages; request opening through the context/store API.

---

## Route-Specific Modals

For local confirmations such as delete or leave-page confirmation, use Shadcn `<AlertDialog>` mounted near the trigger. Do not put these in providers.

```tsx
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>Delete?</AlertDialogTitle>
    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
  </AlertDialogContent>
</AlertDialog>
```

Rules:
- Destructive action button uses `variant="destructive"`.
- Primary action position follows RTL product layout.
- Copy is short and written in the product language.

---

## Toast: `ToastProvider`

`ToastProvider` lives in [lib/toast-context.tsx](../../lib/toast-context.tsx).

API:

```ts
const { showToast } = useToast();
showToast('Saved successfully', 'success');
showToast('Unable to send the form', 'error');
showToast('Draft saved', 'info');
```

Behavior:
- Three types: `success`, `error`, `info`.
- Default lifetime: 4 seconds.
- Position: bottom center, max width `sm`.
- Motion: `framer-motion` with `AnimatePresence`.

Rules:
- Never use browser `alert()` or `confirm()`.
- Blocking errors use an `error` toast and keep the form/modal open for correction.
- Success messages that require user action use `info` with a longer duration instead of a short success toast.

Do not use toast for:
- Page-level errors; use `<EmptyState>` or an inline error.
- Field validation errors; show them below the relevant `<FormField>`.
- Delete confirmation; use `<AlertDialog>`.

---

## Modal With Form Anatomy

Example:

```tsx
'use client';
export function OnboardingModal() {
  const { isOnboardingModalOpen, closeOnboardingModal } = useAuth();
  const form = useOnboardingForm({ onSuccess: closeOnboardingModal });

  return (
    <Dialog open={isOnboardingModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(form.onSubmit)}>
          {/* FormField components */}
          <Button type="submit" disabled={form.isSubmitting}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

Rules:
- Use a form hook such as `useOnboardingForm`; do not implement form logic inside the modal component.
- Do not set `onOpenChange={closeOnboardingModal}` when the modal must remain open until completion.
- Use Radix prevention handlers, such as `onPointerDownOutside={(e) => e.preventDefault()}`, when dismissal is not allowed.
- Loading state belongs on the submit button: disabled + spinner. Do not block the entire modal.

---

## Accessibility

- Every modal supports `Esc` close when dismissal is allowed.
- Focus is trapped inside the modal.
- Focus returns to the trigger after close.
- Toasts use `aria-live="polite"` for success/info and `aria-live="assertive"` for errors.
- `<DialogTitle>` is required, even when visually hidden.

---

## New Interaction Checklist

- [ ] Must block interaction? Use modal/dialog.
- [ ] Transient message? Use toast.
- [ ] Delete or irreversible action? Use `<AlertDialog>` near the trigger.
- [ ] Side panel or filters? Use `<Sheet>` on mobile or a sidebar on desktop.
- [ ] Global one-per-app interaction? Mount in `<Providers>` and control through context/store.
- [ ] Route-specific interaction? Mount in the route component tree.

---

## Design Boundaries

1. Global UI state stays small and centralized. Move to `useUiStore` when global modal state grows beyond a small context.
2. Toasts must not re-render the whole app tree. If context becomes a bottleneck, move toast state to a store.
3. Toast accessibility is part of the contract: `polite` for success/info, `assertive` for errors.

---

## Non-Urgent Recommendations

1. **`useUiStore`.** Replace `AuthContext` + `ToastContext` with a small Zustand UI store if global UI state grows.
2. **Toast queue limit.** Cap visible toasts at three.
3. **Context-aware toast positions.** Use top-right on desktop and bottom-center on mobile.
4. **Persistent toasts for long operations.** Add `showToast` returning `id` plus `dismissToast(id)`.
5. **Parallel Routes for `LoginModal`.** `app/@modal/(.)login/page.tsx` can make the login modal shareable by URL.
6. **Confirm dialog wrapper.** Add `<ConfirmDialog title onConfirm trigger>` to reduce repeated boilerplate.
7. **Sonner.** Consider `shadcn/sonner` if the local toast implementation needs queueing, persistence, and richer positioning.
