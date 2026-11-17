import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink  , Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './change-password.css',
  templateUrl: './change-password.html',
})
export class ChangePassword {
  accountName: string;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  readonly passwordForm = new FormGroup({
    currentPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    confirmNewPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly auth: Auth,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly router : Router
  ) {
    this.accountName = auth.getAccountName() ?? 'Account';
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || this.isLoading) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      this.passwordForm.getRawValue();

    this.errorMessage = '';
    this.successMessage = '';

    if (newPassword !== confirmNewPassword) {
      this.errorMessage = 'The new passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.auth
      .changePassword(currentPassword, newPassword, confirmNewPassword)
      .subscribe({
        next: (response: unknown) => {
          const result = (response ?? {}) as {
            status?: string;
            message?: string;
            Message?: string;
          };

          if (result.status?.toLowerCase() === 'error') {
            this.errorMessage =
              result.message ?? result.Message ?? 'Password update failed.';
          } else {
            this.successMessage =
              result.message ?? result.Message ?? 'Password updated.';
            this.passwordForm.reset();
          }

          this.isLoading = false;
          this.changeDetector.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const body = error.error as {
            message?: unknown;
            Message?: unknown;
          } | null;

          const message = body?.message ?? body?.Message;
          this.errorMessage =
            typeof message === 'string'
              ? message
              : `Password update failed (${error.status}).`;

          this.isLoading = false;
          this.changeDetector.detectChanges();
        },
      });
  }

  logout() : void {
    this.auth.clearAccessToken();
     void this.router.navigateByUrl('/login');
  }
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
}