import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest, LeaveApprovalResult } from '../models/leave-request.model';

export interface LeaveRequestCreate {
    employee: { emplId: number };
    leaveType: { leaveTypeId: number };
    startDate: string;
    endDate: string;
}

export interface StatusUpdate {
    status: string;
    comment?: string;
}

export interface SearchParams {
    status?: string;
    departmentId?: number;
    leaveTypeId?: number;
    employeeId?: number;
    startDate?: string;
    endDate?: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/leave-requests';

    getAll(): Observable<LeaveRequest[]> {
        return this.http.get<LeaveRequest[]>(this.baseUrl);
    }

    getById(id: number): Observable<LeaveRequest> {
        return this.http.get<LeaveRequest>(`${this.baseUrl}/${id}`);
    }

    create(request: LeaveRequestCreate): Observable<LeaveRequest> {
        return this.http.post<LeaveRequest>(this.baseUrl, request);
    }

    updateStatus(id: number, update: StatusUpdate): Observable<LeaveApprovalResult> {
        return this.http.put<LeaveApprovalResult>(`${this.baseUrl}/${id}/status`, update);
    }

    cancel(id: number): Observable<LeaveApprovalResult> {
        return this.updateStatus(id, { status: 'CANCELLED' });
    }

    downloadPdf(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
    }

    search(params: SearchParams): Observable<LeaveRequest[]> {
        let httpParams = new HttpParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                httpParams = httpParams.set(key, value.toString());
            }
        });
        return this.http.get<LeaveRequest[]>(`${this.baseUrl}/search`, { params: httpParams });
    }
}