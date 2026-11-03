import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7172/api/Auth';

  constructor(private http: HttpClient) {}

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        localStorage.setItem('filmLogToken', response.token);
        localStorage.setItem('filmLogEmail', response.email);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('filmLogToken');
    localStorage.removeItem('filmLogEmail');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('filmLogToken');
  }

  getToken(): string | null {
    return localStorage.getItem('filmLogToken');
  }
}
