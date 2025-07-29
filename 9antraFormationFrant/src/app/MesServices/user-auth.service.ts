import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private rolesSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  constructor() {}
  public setRoles(roles: any) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
  public getRoles1(): string[] {
    const roles = localStorage.getItem('roles');
    if (roles) {
      return JSON.parse(roles);
    } else {
      return [];
    }
  }

  public getRoles(): [] {
    const roles = JSON.parse(localStorage.getItem('roles')!);
    if (roles) {
      return JSON.parse(roles);
    } else {
      return [];
    }
  }
  public setToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }
  public getToken(): string {
    return localStorage.getItem('jwtToken')!;
  }

  public setId(id: number) {
    localStorage.setItem('id', id.toString());
  }

  public getId(): number {
    return Number(localStorage.getItem('id'))!;
  }

  public setFirstName(firstName:string) {
    localStorage.setItem('firstName', firstName.toString());
  }
  public getFirstName(): string {
    return localStorage.getItem('firstName')!;
  }

  public setLastName(lastName:string) {
    return localStorage.setItem('lastName',lastName.toString())!;
  }
  public getLastName(): string {
    return localStorage.getItem('lastName')!;
  }

  public getImage(): string {
    return localStorage.getItem('image')!;
  }
  public getUsername(): string {
    const email = JSON.parse(localStorage.getItem('username')!);
    return JSON.parse(email);
  }
  public setUsername(email:any) {
    localStorage.setItem('email',JSON.stringify(email));
  }
  public setRolesSession(roles: any) {
    sessionStorage.setItem('roles', JSON.stringify(roles));
  }
  public getRolesSession(): [] {
    const roles = JSON.parse(sessionStorage.getItem('roles')!);
    if (roles) {
      return JSON.parse(roles);
    } else {
      return [];
    }
  }

  public setSessionId(id: number) {
    sessionStorage.setItem('id', id.toString());
  }
  public getSessionId(): number {
    return Number(sessionStorage.getItem('id'))!;
  }

  public setTokenSession(jwtToken: string) {
    sessionStorage.setItem('jwtToken', jwtToken);
  }
  public getTokenSession(): string {
    return sessionStorage.getItem('jwtToken')!;
  }
  /*private updateRolesSubject(roles: string[]): void {
    this.rolesSubject.next(roles);
    localStorage.setItem('roles', JSON.stringify(roles));
    console.log('roles please : ' + roles);
  }
  private getRolesFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles;
      console.log('Decoded roles:', roles);
      this.updateRolesSubject(roles);
    } else {
      console.log('No token found');
      this.clearRolesSubject();
    }
  }
  private clearRolesSubject(): void {
    this.rolesSubject.next([]);
    localStorage.removeItem('roles');
  }*/
  isLoggedIn2(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
  public clear() {
    localStorage.clear();
    sessionStorage.clear();
  }
  // public isLoggedIn() {
  //   return this.getRoles() && this.getToken() ;
  // }
  public isLoggedIn1(): boolean {
    const roles = this.getRoles1();
    const token = this.getToken();
    return !!(roles && token);
  }
  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }
  public setUserData(userData: any) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  public getUserData(): any {
    const userData = JSON.parse(localStorage.getItem('userData')!);
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }
}
