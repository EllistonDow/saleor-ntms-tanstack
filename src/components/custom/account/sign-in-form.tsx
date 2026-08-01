import { useForm } from "@tanstack/react-form";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { StatusPanel } from "@/components/custom/layout/status-panel";
import { LoaderButton } from "@/components/custom/loader-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AccountActionError,
  useSignInMutation,
} from "@/hooks/use-account-mutations";
import { useHydrated } from "@/hooks/use-hydrated";
import { getSafeInternalRedirect } from "@/lib/safe-redirect";
import { isSaleorStorefront } from "@/lib/storefront-mode";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInSubmitError = {
  message: string;
  code?: string;
};

const unconfirmedAccountCodes = new Set([
  "ACCOUNT_NOT_CONFIRMED",
  "ACCOUNT_NOT_CONFIRMED_ERROR",
  "NOT_VERIFIED",
  "NOT_VERIFIED_ERROR",
]);

const invalidCredentialsCodes = new Set([
  "INVALID_CREDENTIALS",
  "INVALID_CREDENTIALS_ERROR",
]);

function getSignInSubmitError(error: unknown): SignInSubmitError {
  if (error instanceof AccountActionError) {
    return {
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Error signing in",
  };
}

function getSignInErrorPanel(error: SignInSubmitError) {
  const code = error.code?.toUpperCase();

  if (code && unconfirmedAccountCodes.has(code)) {
    return {
      title: "Email confirmation required",
      description: (
        <span>
          This account still needs email confirmation. Check your inbox for the
          Nuclear Tattoo Supply confirmation email from
          noreply@nucleartattoosupply.com, then sign in again.
        </span>
      ),
    };
  }

  if (code && invalidCredentialsCodes.has(code)) {
    return {
      title: "Email or password is incorrect",
      description: (
        <span>
          Check the password and try again. If this email was registered
          earlier, use Forgot password to set a fresh password.
        </span>
      ),
    };
  }

  return {
    title: "Sign in failed",
    description: error.message,
  };
}

export function SignInForm() {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <SignInFormSkeleton />;
  }

  return <ClientSignInForm />;
}

function ClientSignInForm() {
  const router = useRouter();
  const { redirect } = useSearch({ strict: false });
  const [submitError, setSubmitError] = useState<SignInSubmitError | null>(
    null,
  );
  const signInMutation = useSignInMutation();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        await signInMutation.mutateAsync({
          username: value.username,
          password: value.password,
        });

        toast.success("Welcome back!");
        router.navigate({ to: getSafeInternalRedirect(redirect) });
      } catch (error) {
        const nextError = getSignInSubmitError(error);
        setSubmitError(nextError);
        toast.error(nextError.message);
      }
    },
  });

  const errorPanel = submitError ? getSignInErrorPanel(submitError) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {errorPanel ? (
        <StatusPanel
          variant="destructive"
          title={errorPanel.title}
          description={errorPanel.description}
          testId="sign-in-error"
          size="compact"
        />
      ) : null}
      <FieldGroup>
        <form.Field
          name="username"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>E-Mail</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="john.doe@acme.com"
                  autoComplete="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="current-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <LoaderButton
        loading={signInMutation.isPending}
        className="w-full"
        type="submit"
      >
        Sign in securely
      </LoaderButton>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-foreground/55">
        <Link
          to="/forgot-password"
          className="font-medium text-[color:var(--cyber-gold-soft)] underline underline-offset-4 hover:text-[color:var(--cyber-gold)]"
        >
          Forgot password?
        </Link>
        {isSaleorStorefront ? null : (
          <Link
            to="/resend-verification"
            className="font-medium text-[color:var(--cyber-gold-soft)] underline underline-offset-4 hover:text-[color:var(--cyber-gold)]"
          >
            Resend verification
          </Link>
        )}
      </div>
    </form>
  );
}

function SignInFormSkeleton() {
  const fallbackId = useId();
  const usernameId = `${fallbackId}-username`;
  const passwordId = `${fallbackId}-password`;

  return (
    <form className="space-y-4" aria-busy="true">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={usernameId}>E-Mail</FieldLabel>
          <Input
            id={usernameId}
            name="username"
            placeholder="john.doe@acme.com"
            autoComplete="email"
            disabled
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            disabled
          />
        </Field>
      </FieldGroup>
      <LoaderButton disabled className="w-full" type="submit">
        Sign in
      </LoaderButton>
    </form>
  );
}
