import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachment } from '../models/attachment.model';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/attachments';

    upload(file: File, leaveRequestId: number): Observable<Attachment> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('leaveRequestId', leaveRequestId.toString());
        return this.http.post<Attachment>(this.baseUrl, formData);
    }

    getAll(): Observable<Attachment[]> {
        return this.http.get<Attachment[]>(this.baseUrl);
    }

    download(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${id}/download`, { responseType: 'blob' });
    }
}