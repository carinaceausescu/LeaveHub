import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/departments';

    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(this.baseUrl);
    }

    getById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.baseUrl}/${id}`);
    }

    create(department: Partial<Department>): Observable<Department> {
        return this.http.post<Department>(this.baseUrl, department);
    }

    update(id: number, department: Partial<Department>): Observable<Department> {
        return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}