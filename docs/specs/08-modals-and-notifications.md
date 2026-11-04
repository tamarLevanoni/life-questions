# Modals and notifications

## Goal

Keep modal ownership and feedback predictable across routes.

## Implemented providers

[`app/providers.tsx`](../../app/providers.tsx) composes ThemeProvider, SessionProvider, ToastProvider, WhatsAppProvider and AuthProvider. `AuthRuntime` mounts global login/onboarding UI under Suspense. [`lib/auth-context.tsx`](../../lib/auth-context.tsx) owns only modal open/close state; session/user data belongs to NextAuth and `useUserStore`.

The Google login UI opens a popup. The callback posts a same-origin auth-callback message; `SessionUserSync` validates origin and refreshes the session. See [Auth](05-auth.md).

WhatsApp has its own context and shared invite modal. Route-specific dialogs, such as contact success, remain with their route components.

## Dialog behavior

Use existing Radix dialog primitives for focus trapping, Escape handling and focus return. Give every dialog a meaningful title/description. Keep controls named, keyboard-operable and large enough for touch.

[`LoginModal`](../../components/auth/login-modal.tsx) prevents closing while its Google popup flow is pending and restores focus to the opening control. [`OnboardingModal`](../../components/auth/onboarding-modal.tsx) requires a leave confirmation when closing or skipping registration: return to the form or sign out. Preserve this explicit onboarding rule; other dialogs should allow ordinary dismissal unless an in-flight operation requires a documented exception.

## Toast feedback

[`useToast().showToast(message, typeOrOptions)`](../../lib/toast-context.tsx) supports success/error/info, persistence and top/bottom positioning. Errors default to the top; other types default to the bottom. Toasts announce through `role="status"` with polite live updates. Use form validation inline for field errors and a toast/dialog for submission feedback. Preserve form content on failure. Do not replace recoverable UI with `window.alert` or silently swallow failures.

The toast provider is a custom implementation; no external toast library or global logger service is installed. [Accessibility tests](../../tests/e2e/accessibility.spec.ts) exercise form error descriptions/focus, login focus handling and onboarding leave confirmation. They do not establish screen-reader announcement behavior; that requires a manual check. The [quality foundation record](../planning/project-quality-foundation.md) tracks completed runs and remaining limitations.

## Design changes

Shared modal/toast appearance follows [UI principles](06-design-system.md). Test opening, closing, pending state, keyboard operation and appropriate focus without making the functional test depend on the current gradient or CSS classes.
