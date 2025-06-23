import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userKey = 'user'; // Key for sessionStorage
  private user: any = null; // Declare the user property

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  setUser(user: any): void {
    if (this.isBrowser()) {
      this.user = user;
    }
  }

  getUser(): any {
    if (this.isBrowser() && !this.user) {
      const userData = sessionStorage.getItem(this.userKey); // Retrieve user from sessionStorage
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    return this.user;
  }

  clearUser(): void {
    if (this.isBrowser()) {
      this.user = null;
      sessionStorage.removeItem(this.userKey); // Remove user from sessionStorage
    }
  }
}