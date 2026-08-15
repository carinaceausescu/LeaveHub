import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
    emplId: number;
    name: string;
    email: string;
    role: string;
    departmentId: number | null;
    departmentName: string | null;
    annualLeaveDays: number;
    availableLeaveDays: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/auth';
    private readonly STORAGE_KEY = 'leaveHubUser';

    currentUser = signal<LoginResponse | null>(this.loadFromStorage());

    isAdmin = computed(() => this.currentUser()?.role?.toLowerCase() === 'admin');
    isManager = computed(() => this.currentUser()?.role?.toLowerCase() === 'dept_resp');
    isLoggedIn = computed(() => this.currentUser() !== null);

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
        tap((response) => {
            this.currentUser.set(response);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
        })
        );
    }

    logout(): void {
        this.currentUser.set(null);
        localStorage.removeItem(this.STORAGE_KEY);
    }

    private loadFromStorage(): LoginResponse | null {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
}