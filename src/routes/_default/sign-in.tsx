import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AuthShell } from "@/components/custom/account/auth-shell";
import { SignInForm } from "@/components/custom/account/sign-in-form";
import { serverEnv } from "@/env/server";
import { createBasicMeta } from "@/lib/metadata";

const signInSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

const getBuildVersion = createServerFn({ method: "GET" }).handler(
  async () => serverEnv.VITE_APP_BUILD_VERSION?.trim() ?? null,
);

export const Route = createFileRoute("/_default/sign-in")({
  validateSearch: signInSearchSchema,
  loader: async () => ({
    buildVersion: await getBuildVersion(),
  }),
  head: () => ({
    meta: createBasicMeta(
      "Sign In",
      "Sign in to your account to access your orders, saved items, and account settings.",
      true, // private page
    ),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      throw redirect({ to: search.redirect || "/account" });
    }
  },
  component: SignInComponent,
});

function SignInComponent() {
  const { buildVersion } = Route.useLoaderData();

  return (
    <AuthShell
      activeAuthTab="sign-in"
      eyebrow="Sign in"
      title="Access your studio account"
      description="Sign in before checkout to keep carts, orders, addresses, and payment state tied to the same customer profile."
      buildVersion={buildVersion}
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyber-gold-soft)]">
          Customer login
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h2>
        <p className="mt-2 text-sm leading-6 text-foreground/55">
          Continue to checkout, account settings, and order history.
        </p>
      </div>
      <SignInForm />
    </AuthShell>
  );
}
