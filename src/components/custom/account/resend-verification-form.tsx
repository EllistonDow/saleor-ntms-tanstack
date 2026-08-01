import { useForm } from "@tanstack/react-form";
import { MailCheck } from "lucide-react";
import { useState } from "react";
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
import { useRefreshCustomerVerificationMutation } from "@/hooks/use-account-mutations";

const resendVerificationSchema = z.object({
  emailAddress: z.email("Enter a valid email address"),
});

export function ResendVerificationForm() {
  const refreshVerificationMutation = useRefreshCustomerVerificationMutation();
  const [sent, setSent] = useState(false);

  const form = useForm({
    defaultValues: {
      emailAddress: "",
    },
    validators: {
      onSubmit: resendVerificationSchema,
    },
    onSubmit: async ({ value }) => {
      await refreshVerificationMutation.mutateAsync(value.emailAddress);
      setSent(true);
      toast.success("Verification email sent.");
    },
  });

  if (sent) {
    return (
      <StatusPanel
        icon={<MailCheck className="h-5 w-5" />}
        title="Check your email"
        description="If that account needs verification, a fresh verification link has been sent."
        testId="resend-verification-success"
      />
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      {refreshVerificationMutation.error ? (
        <StatusPanel
          variant="destructive"
          size="compact"
          title="Verification email failed"
          description={refreshVerificationMutation.error.message}
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
                <FieldLabel htmlFor={field.name}>E-Mail</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  placeholder="john.doe@acme.com"
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <LoaderButton
        loading={refreshVerificationMutation.isPending}
        className="w-full"
        type="submit"
      >
        Send verification email
      </LoaderButton>
    </form>
  );
}
