import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/employees';

    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseUrl);
    }

    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.baseUrl}/${id}`);
    }

    create(employee: any): Observable<Employee> {
        return this.http.post<Employee>(this.baseUrl, employee);
    }

    update(id: number, employee: any): Observable<Employee> {
        return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}