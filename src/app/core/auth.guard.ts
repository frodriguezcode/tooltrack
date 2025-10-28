import { CanActivateFn, Router  } from '@angular/router';
import { inject } from '@angular/core';
import { AuthPinService } from './auth-pin.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthPinService);
  const router = inject(Router);

  if (auth.check()) return true;

  router.navigateByUrl('/login');
  return false;

};
