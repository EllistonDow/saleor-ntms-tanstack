import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/custom/account/auth-shell";
import { RequestPasswordResetForm } from "@/components/custom/account/request-password-reset-form";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_default/forgot-password")({
  head: () => ({
    meta: createBasicMeta(
      "Reset Password",
      "Request a password reset link for your customer account.",
      true,
    ),
  }),
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/account/security" });
    }
  },
  component: ForgotPasswordComponent,
});

function ForgotPasswordComponent() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset your password"
      description="Enter your account email and the store will send a one-time password reset link if the account exists."
      footer={
        <p className="text-center text-sm text-foreground/55">
          Remembered it?{" "}
          <Link
            to="/sign-in"
            className="font-semibold text-[color:var(--cyber-gold-soft)] underline underline-offset-4 hover:text-[color:var(--cyber-gold)]"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
          Recover account
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Send reset link
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground/55">
          Use the email address attached to your customer account.
        </p>
      </div>
      <RequestPasswordResetForm />
    </AuthShell>
  );
}
