import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Users } from './pages/users/users';
import { ChangePassword } from './pages/change-password/change-password';
import { CreateUser } from './pages/create-user/create-user';
import { authGuard } from './guards/auth-guard';
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
        component : Users,
        canActivate : [authGuard]
    },
    {
        path : 'change-password',
        component : ChangePassword,
        canActivate : [authGuard]
    },
    {
        path : 'create-user',
        component : CreateUser,
        canActivate : [authGuard]
    }
];
