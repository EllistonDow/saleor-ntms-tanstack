import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/components/custom/account/auth-shell";
import { RegisterForm } from "@/components/custom/account/register-form";
import { createBasicMeta } from "@/lib/metadata";

export const Route = createFileRoute("/_default/register")({
  head: () => ({
    meta: createBasicMeta(
      "Register",
      "Create a new account to access your orders, saved items, and account settings.",
      true, // private page
    ),
  }),
  beforeLoad: ({ context }) => {
    // Redirect to account if user is already logged in
    if (context.user) {
      throw redirect({ to: "/account" });
    }
  },
  component: RegisterComponent,
});

function RegisterComponent() {
  return (
    <AuthShell
      activeAuthTab="register"
      eyebrow="Create account"
      title="Build your customer profile"
      description="Create a customer account for checkout access, order tracking, and a cleaner repeat ordering workflow for tattoo shop supplies."
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
          New customer
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Create account
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground/55">
          Use a valid email so verification and order messages can reach you.
        </p>
      </div>
      <RegisterForm />
    </AuthShell>
  );
}
