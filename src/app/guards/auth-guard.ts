import { CanActivateFn , Router} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../services/auth';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if(auth.getAccessToken()){
  return true;
  }

  return router.createUrlTree(['/login'] , {
    queryParams : {
      returnUrl : state.url
    }
  })
};
