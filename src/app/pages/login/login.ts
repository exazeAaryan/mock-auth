import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validator } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  imports: [ReactiveFormsModule],
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

  constructor(private auth : Auth , private cdr : ChangeDetectorRef){}

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
      next : () => {
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
