import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveType } from '../models/leave-request.model';

@Injectable({ providedIn: 'root' })
export class LeaveTypeService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/leave-types';

    getAll(): Observable<LeaveType[]> {
        return this.http.get<LeaveType[]>(this.baseUrl);
    }

    getById(id: number): Observable<LeaveType> {
        return this.http.get<LeaveType>(`${this.baseUrl}/${id}`);
    }

    create(leaveType: Partial<LeaveType>): Observable<LeaveType> {
        return this.http.post<LeaveType>(this.baseUrl, leaveType);
    }

    update(id: number, leaveType: Partial<LeaveType>): Observable<LeaveType> {
        return this.http.put<LeaveType>(`${this.baseUrl}/${id}`, leaveType);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}