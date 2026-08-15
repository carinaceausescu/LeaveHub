import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveWorkflow } from '../models/leave-workflow.model';

@Injectable({ providedIn: 'root' })
export class LeaveWorkflowService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/leave-workflows';

    getAll(): Observable<LeaveWorkflow[]> {
        return this.http.get<LeaveWorkflow[]>(this.baseUrl);
    }
}