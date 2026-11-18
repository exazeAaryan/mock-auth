import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validator } from '@angular/forms';
import { Auth } from '../../services/auth';
import { RouterLink , Router } from '@angular/router';

function resolveAccountName(response: unknown, token: string, fallback: string): string {
  const root = (response && typeof response === 'object' ? response : {}) as Record<string, unknown>;
  const data = (root['data'] && typeof root['data'] === 'object' ? root['data'] : {}) as Record<string, unknown>;
  const user = (data['user'] && typeof data['user'] === 'object' ? data['user'] : {}) as Record<string, unknown>;
  const records = [root, data, user];
  const nameKeys = ['DisplayName', 'displayName', 'UserName', 'Username', 'userName', 'username', 'Name', 'name'];

  for (const record of records) {
    for (const key of nameKeys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    const firstName = record['FirstName'] ?? record['firstName'] ?? record['given_name'];
    const lastName = record['LastName'] ?? record['lastName'] ?? record['family_name'];
    if (typeof firstName === 'string' && typeof lastName === 'string') {
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) return fullName;
    }
  }

  try {
    const encodedPayload = token.split('.')[1];
    if (encodedPayload) {
      const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
      const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
      const payloadText = decodeURIComponent(
        Array.from(binary, (character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
      );
      const claims = JSON.parse(payloadText) as Record<string, unknown>;
      const claimName = claims['name'] ?? claims['preferred_username'] ?? claims['unique_name'] ?? claims['email'];
      if (typeof claimName === 'string' && claimName.trim()) {
        return claimName.trim();
      }
    }
  } catch {
    // The API token may not be a JWT with readable profile claims.
  }

  return fallback;
}

@Component({
  imports: [ReactiveFormsModule , RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginForm = new FormGroup({

    email : new FormControl('' , [
      Validators.required,
      Validators.email
    ]),

  password : new FormControl('' , [
    Validators.required,
    // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).+$/),
    // Validators.minLength(6)
  ]),
  })

  constructor(private auth : Auth , private cdr : ChangeDetectorRef , private router : Router,){}

  loginMessage = '';

  isLoading = false;

  onSubmit() : void {
    if(this.loginForm.invalid || this.isLoading)
    {
      return;
    }

    const email  = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.loginMessage = '';
    this.isLoading = true;

    this.auth.login(email , password).subscribe({
      next : (response: unknown) => {
        const body = (response ?? {}) as {
          Token?: unknown;
          data?: { Token?: unknown } | null;
        };
        const token = body.Token ?? body.data?.Token;

        if (typeof token !== 'string' || !token) {
          this.loginMessage = 'The login response did not contain a token.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.auth.setAccessToken(token);
        this.auth.setAccountName(resolveAccountName(response, token, email.trim()));
        // void this.router.navigateByUrl('/users')

        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];

const destination =
  typeof returnUrl === 'string' &&
  returnUrl.startsWith('/') &&
  !returnUrl.startsWith('//')
    ? returnUrl
    : '/users';

void this.router.navigateByUrl(destination);
        this.loginMessage = 'Login successful';
        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error : (error) =>{
          const message = error.error?.message ?? error.error?.Message;

          this.loginMessage = typeof message === 'string' ? message : `Login Failed (${error.status}).`;

          this.isLoading = false;
          this.cdr.detectChanges();
          
      }
    })
  }

  showPassword = false;
}
