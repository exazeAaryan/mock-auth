import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['../login/login.css', './forgot-password.css'],
})
export class ForgotPassword {
  readonly forgotForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly auth: Auth,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    if (this.forgotForm.invalid || this.isLoading) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.auth.forgotPassword(this.forgotForm.controls.email.value).subscribe({
      next: (response: unknown) => {
        const result = (response ?? {}) as {
          status?: string;
          message?: string;
          Message?: string;
        };

        if (result.status?.toLowerCase() === 'error') {
          this.errorMessage =
            result.message ?? result.Message ?? 'The reset request failed.';
        } else {
          this.successMessage =
            result.message ??
            result.Message ??
            'If this email is registered, reset instructions have been sent.';
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
            : `Reset request failed (${error.status}).`;

        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
