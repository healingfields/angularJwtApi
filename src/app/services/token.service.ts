import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  set(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.id);
  }

  handle(data): void {
    this.set(data);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getId(): string {
    return localStorage.getItem('id');
  }

  remove(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  }

  decode(payload): any {
    return JSON.parse(atob(payload));
  }

  payload(token): any {
    const payload = token.split('.')[1];
    console.log('payload', payload);
    return this.decode(payload);
  }

  isValid(): boolean {
    const token = this.getToken();
    const id = this.getId();

    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return id === payload.id;
      }
    }
    return false;
  }

  getInfos(): any {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      return payload ? payload : null;
    }
    return null;
  }

  loggedIn(): boolean {
    return this.isValid();
  }
}
