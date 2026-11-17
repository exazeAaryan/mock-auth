import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Users } from './pages/users/users';
import { ChangePassword } from './pages/change-password/change-password';
export const routes: Routes = [
    {
        path : '',
        redirectTo : 'login',
        pathMatch : 'full'
    },
    {
        path : 'login',
        component : Login
    },
    {
        path : 'forgot-password',
        component : ForgotPassword
    },
    {
        path : 'users',
        component : Users
    },
    {
        path : 'change-password',
        component : ChangePassword
    }
];
