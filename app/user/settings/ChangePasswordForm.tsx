'use client';

import {useState} from 'react';
import {VStack} from '@astryxdesign/core/VStack';
import {HStack} from '@astryxdesign/core/HStack';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import {PasswordInput} from '@/app/components/forms/PasswordInput';

import {changePassword} from '@/actions/users/password';

const MIN_PASSWORD_LENGTH = 8; // Matches the server-side rule.

interface FieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Change-password form: the current password is the proof of ownership, so
 * no email/reset-token flow is involved. Validation mirrors the server rules.
 */
export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function clearFieldError(key: keyof FieldErrors) {
    setFieldErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }
      const next = {...previous};
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setIsSaved(false);

    const errors: FieldErrors = {};
    if (!currentPassword) {
      errors.currentPassword = 'Enter your current password.';
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords don’t match.';
    }
    if (currentPassword && newPassword === currentPassword) {
      errors.newPassword = 'New password must be different from your current password.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSaving(true);
    const result = await changePassword({currentPassword, newPassword});
    setIsSaving(false);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    // The change has no visible effect on this page, so confirm inline.
    setIsSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4}>
        {serverError ? <Banner status="error" title={serverError} /> : null}
        {isSaved ? (
          <Banner
            status="success"
            title="Password updated"
            description="Use your new password next time you sign in."
          />
        ) : null}

        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChange={(next) => {
            setCurrentPassword(next);
            clearFieldError('currentPassword');
          }}
          placeholder="Your current password"
          isRequired
          isDisabled={isSaving}
          status={fieldErrors.currentPassword ? {type: 'error', message: fieldErrors.currentPassword} : undefined}
        />
        <PasswordInput
          label="New password"
          value={newPassword}
          onChange={(next) => {
            setNewPassword(next);
            clearFieldError('newPassword');
          }}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          isRequired
          isDisabled={isSaving}
          status={fieldErrors.newPassword ? {type: 'error', message: fieldErrors.newPassword} : undefined}
        />
        <PasswordInput
          label="Confirm new password"
          value={confirmPassword}
          onChange={(next) => {
            setConfirmPassword(next);
            clearFieldError('confirmPassword');
          }}
          placeholder="Repeat your new password"
          isRequired
          isDisabled={isSaving}
          status={fieldErrors.confirmPassword ? {type: 'error', message: fieldErrors.confirmPassword} : undefined}
        />

        <HStack gap={2} vAlign="center">
          <Button
            label={isSaving ? 'Updating…' : 'Update password'}
            variant="primary"
            type="submit"
            isLoading={isSaving}
            isDisabled={isSaving}
          />
        </HStack>
      </VStack>
    </form>
  );
}
