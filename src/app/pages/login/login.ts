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
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).+$/),
    Validators.minLength(6)
  ]),
  })

  constructor(private auth : Auth , private cdr : ChangeDetectorRef){}

  loginError = '';

  isLoading = false;
  onSubmit()
  {
    if (this.loginForm.invalid || this.isLoading)
      {
        return;
      }  

      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';

      this.loginError = '';
      this.isLoading = true;

      setTimeout( () => {
        const isAuthenticated = this.auth.login(email , password);

        if(isAuthenticated)
        {
          this.loginError = 'Login Successful' 
        }
        else
        {
          this.loginError = 'Invalid email or password'
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      } , 1000)
  }

  showPassword = false;
}
