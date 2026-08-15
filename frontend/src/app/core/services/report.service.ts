import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/reports';

    downloadPendingRequests(): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/pending-requests/pdf`, { responseType: 'blob' });
    }

    downloadDepartmentBalance(): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/department-balance/pdf`, { responseType: 'blob' });
    }

    downloadLeaveUsage(): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/leave-usage/pdf`, { responseType: 'blob' });
    }
}