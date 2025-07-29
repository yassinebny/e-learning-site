import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import {UserAuthService} from "./user-auth.service";


export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(UserAuthService);

  // Get the token from localStorage or wherever you store it
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    router.navigate(['login']);
    return false;
  }

  const user = authService.getToken()
  var loggedUser = user
  // Decode the token to get the user role
  const userRoles = authService.getRoles1(); // assuming getRoles1() returns a string[]
// Check if the user roles include "ETUDIANT" or "FORMATEUR"
  if (userRoles.includes('ETUDIANT') || userRoles.includes('FORMATEUR')) {
    return true;
  } else {
    // Redirect to unauthorized page or do something else
    router.navigate(['unauthorized']);
    return false;
  }
}
export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(UserAuthService);

  // Get the token from localStorage or wherever you store it
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    router.navigate(['login']);
    return false;
  }
  const user = authService.getToken()
  var loggedUser= user
  // Decode the token to get the user role
  const userRoles = authService.getRoles1(); // assuming getRoles1() returns a string[]

  // Check if the user role is "Admin"
  if (userRoles.includes('ADMINISTRATEUR') ) {
    return true;
  } else {
    // Redirect to unauthorized page or do something else
    router.navigate(['unauthorized']);
    return false;
  }
};
export const authGuardLoginRegister: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(UserAuthService);


  const user = authService.getToken()
  var loggedUser = user
  // Decode the token to get the user role
  const userRoles = authService.getRoles1(); // assuming getRoles1() returns a string[]
// Check if the user roles include "ETUDIANT" or "FORMATEUR"
  if (userRoles.includes('ETUDIANT') || userRoles.includes('FORMATEUR') || userRoles.includes('ADMINISTRATEUR')) {
    router.navigate(['/']);
    return false;
  } else {
    // Redirect to unauthorized page or do something else

    return true;
  }
}
