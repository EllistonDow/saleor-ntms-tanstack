import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
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
import { useRegisterAccountMutation } from "@/hooks/use-account-mutations";
import { useHydrated } from "@/hooks/use-hydrated";

const formSchema = z
  .object({
    emailAddress: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string(),
    title: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <RegisterFormSkeleton />;
  }

  return <ClientRegisterForm />;
}

function ClientRegisterForm() {
  const router = useRouter();
  const registerAccountMutation = useRegisterAccountMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      emailAddress: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      title: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        await registerAccountMutation.mutateAsync({
          emailAddress: value.emailAddress,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
          phoneNumber: value.phoneNumber || undefined,
          title: value.title || undefined,
        });

        toast.success(
          "Check your email for the confirmation link. If this email was already registered, sign in with the original password or reset it.",
        );
        router.navigate({ to: "/sign-in" });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creating account";
        setSubmitError(message);
        toast.error(message);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {submitError ? (
        <StatusPanel
          variant="destructive"
          title="Account creation failed"
          description={submitError}
          size="compact"
        />
      ) : null}
      <FieldGroup>
        <form.Field
          name="emailAddress"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>E-Mail *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="firstName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>First Name *</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="John"
                    autoComplete="given-name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="lastName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Last Name *</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
        <form.Field
          name="phoneNumber"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
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
                <FieldLabel htmlFor={field.name}>Password *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="confirmPassword"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <LoaderButton
        loading={registerAccountMutation.isPending}
        className="w-full"
        type="submit"
      >
        Create Account
      </LoaderButton>
    </form>
  );
}

function RegisterFormSkeleton() {
  const fallbackId = useId();
  const emailId = `${fallbackId}-email`;
  const firstNameId = `${fallbackId}-first-name`;
  const lastNameId = `${fallbackId}-last-name`;
  const phoneNumberId = `${fallbackId}-phone-number`;
  const passwordId = `${fallbackId}-password`;
  const confirmPasswordId = `${fallbackId}-confirm-password`;

  return (
    <form className="space-y-4" aria-busy="true">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={emailId}>E-Mail *</FieldLabel>
          <Input
            id={emailId}
            name="emailAddress"
            type="email"
            placeholder="john.doe@acme.com"
            autoComplete="email"
            disabled
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={firstNameId}>First Name *</FieldLabel>
            <Input
              id={firstNameId}
              name="firstName"
              placeholder="John"
              autoComplete="given-name"
              disabled
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={lastNameId}>Last Name *</FieldLabel>
            <Input
              id={lastNameId}
              name="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              disabled
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={phoneNumberId}>Phone Number</FieldLabel>
          <Input
            id={phoneNumberId}
            name="phoneNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            disabled
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={passwordId}>Password *</FieldLabel>
          <Input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            disabled
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={confirmPasswordId}>
            Confirm Password *
          </FieldLabel>
          <Input
            id={confirmPasswordId}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            disabled
          />
        </Field>
      </FieldGroup>
      <LoaderButton disabled className="w-full" type="submit">
        Create Account
      </LoaderButton>
    </form>
  );
}
