import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { LeaveWorkflowService } from '../../../core/services/leave-workflow.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { InfoDialog } from '../../../shared/dialogs/info-dialog/info-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-my-requests',
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTableModule, MatChipsModule, MatTooltipModule],
    templateUrl: './my-requests.html',
    styleUrl: './my-requests.css',
})
export class MyRequests implements OnInit {
    private authService = inject(AuthService);
    private leaveRequestService = inject(LeaveRequestService);
    private leaveWorkflowService = inject(LeaveWorkflowService);
    private dialog = inject(MatDialog);

    requests = signal<LeaveRequest[]>([]);
    loading = signal(true);
    cancellingId = signal<number | null>(null);
    rejectionComments = signal<Record<number, string>>({});

    displayedColumns = ['leaveType', 'period', 'days', 'status', 'actions'];

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.loading.set(true);
        const userId = this.authService.currentUser()?.emplId;

        this.leaveRequestService.getAll().subscribe({
            next: (requests) => {
                const filtered = requests
                    .filter(r => r.employee?.emplId === userId)
                    .sort((a, b) => b.leaveRequestId - a.leaveRequestId);
                this.requests.set(filtered);
                this.loading.set(false);
                this.loadRejectionComments();
            },
            error: (err) => {
                console.error('Eroare la încărcarea cererilor:', err);
                this.loading.set(false);
            }
        });
    }

    loadRejectionComments(): void {
        this.leaveWorkflowService.getAll().subscribe({
            next: (workflows) => {
                const comments: Record<number, string> = {};

                for (const wf of workflows) {
                    if (wf.currentStatus === 'REJECTED' && wf.comment) {
                        comments[wf.leaveRequest.leaveRequestId] = wf.comment;
                    }
                }

                this.rejectionComments.set(comments);
            },
            error: (err) => console.error('Eroare la încărcarea istoricului:', err)
        });
    }

    hasRejectionComment(requestId: number): boolean {
        return !!this.rejectionComments()[requestId];
    }

    showRejectionComment(requestId: number): void {
        const comment = this.rejectionComments()[requestId];
        this.dialog.open(InfoDialog, {
            width: '400px',
            data: {
                title: 'Motivul respingerii',
                message: comment
            }
        });
    }

    canCancel(request: LeaveRequest): boolean {
        return request.status === 'PENDING' || request.status === 'DRAFT';
    }

    cancelRequest(request: LeaveRequest): void {
        if (!confirm(`Sigur anulezi cererea de ${request.leaveType.name} din perioada ${request.startDate} - ${request.endDate}?`)) {
            return;
        }

        this.cancellingId.set(request.leaveRequestId);

        this.leaveRequestService.cancel(request.leaveRequestId).subscribe({
            next: () => {
                this.cancellingId.set(null);
                this.loadRequests();
            },
            error: (err) => {
                console.error('Eroare la anularea cererii:', err);
                this.cancellingId.set(null);
                const message = err.error?.error || 'Nu s-a putut anula cererea.';
                alert(message);
            }
        });
    }

    statusLabel(status: string): string {
        const labels: Record<string, string> = {
            DRAFT: 'Ciornă',
            PENDING: 'În așteptare',
            APPROVED: 'Aprobat',
            REJECTED: 'Respins',
            CANCELLED: 'Anulat'
        };
        return labels[status] ?? status;
    }

    statusClass(status: string): string {
        const classes: Record<string, string> = {
            DRAFT: 'status-draft',
            PENDING: 'status-pending',
            APPROVED: 'status-approved',
            REJECTED: 'status-rejected',
            CANCELLED: 'status-cancelled'
        };
        return classes[status] ?? '';
    }

    downloadPdf(request: LeaveRequest): void {
        this.leaveRequestService.downloadPdf(request.leaveRequestId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cerere_concediu_${request.leaveRequestId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => alert('Nu s-a putut descărca PDF-ul.')
        });
    }
}