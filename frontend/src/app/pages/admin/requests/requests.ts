import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { RejectDialog } from '../../../shared/dialogs/reject-dialog/reject-dialog';
import { ConfirmDialog } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttachmentService } from '../../../core/services/attachment.service';
import { Attachment } from '../../../core/models/attachment.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-admin-requests',
    imports: [
        CommonModule, 
        FormsModule, 
        MatIconModule, 
        MatButtonModule, 
        MatTableModule, 
        MatTooltipModule, 
        MatFormFieldModule, 
        MatSelectModule, 
        MatInputModule
    ],
    templateUrl: './requests.html',
    styleUrl: './requests.css',
})
export class AdminRequests implements OnInit {
    authService = inject(AuthService);
    private leaveRequestService = inject(LeaveRequestService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private attachmentService = inject(AttachmentService);

    allRequests = signal<LeaveRequest[]>([]);
    loading = signal(true);
    attachments = signal<Record<number, Attachment>>({});
    processingId = signal<number | null>(null);
    filterStatus = signal<string>('');
    filterLeaveTypeId = signal<string>('');
    filterDepartmentId = signal<string>('');
    filterEmployeeId = signal<string>('');
    filterStartDate = signal<string>('');
    filterEndDate = signal<string>('');

    displayedColumns = ['employee', 'department', 'leaveType', 'period', 'days', 'status', 'document', 'actions'];

    visibleRequests = computed(() => {
        const user = this.authService.currentUser();
        const requests = this.allRequests();

        if (this.authService.isAdmin()) {
            return requests;
        }

        if (this.authService.isManager()) {
            return requests.filter(r => r.employee?.department?.deptId === user?.departmentId);
        }

        return [];
    });

    departmentOptions = computed(() => {
        const map = new Map<number, string>();
        for (const r of this.visibleRequests()) {
            const dept = r.employee?.department;
            if (dept) map.set(dept.deptId, dept.departmentName);
        }
        return Array.from(map.entries()).map(([deptId, departmentName]) => ({ deptId, departmentName }));
    });

    leaveTypeOptions = computed(() => {
        const map = new Map<number, string>();
        for (const r of this.visibleRequests()) {
            map.set(r.leaveType.leaveTypeId, r.leaveType.name);
        }
        return Array.from(map.entries()).map(([leaveTypeId, name]) => ({ leaveTypeId, name }));
    });

    employeeOptions = computed(() => {
        const map = new Map<number, string>();
        for (const r of this.visibleRequests()) {
            map.set(r.employee.emplId, r.employee.name);
        }
        return Array.from(map.entries()).map(([emplId, name]) => ({ emplId, name }));
    });

    filteredRequests = computed(() => {
        const status = this.filterStatus();
        const deptId = this.filterDepartmentId();
        const leaveTypeId = this.filterLeaveTypeId();
        const emplId = this.filterEmployeeId();
        const start = this.filterStartDate();
        const end = this.filterEndDate();

        return this.visibleRequests().filter(r => {
            if (status && r.status !== status) return false;
            if (deptId && r.employee?.department?.deptId.toString() !== deptId) return false;
            if (leaveTypeId && r.leaveType.leaveTypeId.toString() !== leaveTypeId) return false;
            if (emplId && r.employee.emplId.toString() !== emplId) return false;
            if (start && r.endDate < start) return false;
            if (end && r.startDate > end) return false;
            return true;
        });
    });

    pendingRequests = computed(() =>
        this.filteredRequests().filter(r => r.status === 'PENDING')
    );

    historyRequests = computed(() =>
        this.filteredRequests().filter(r => r.status !== 'PENDING')
    );

    ngOnInit(): void {
        this.loadRequests();
    }

    loadRequests(): void {
        this.loading.set(true);
        this.leaveRequestService.getAll().subscribe({
            next: (requests) => {
                const sorted = requests.sort((a, b) => b.leaveRequestId - a.leaveRequestId);
                this.allRequests.set(sorted);
                this.loading.set(false);
                this.loadAttachments();
            },
            error: (err) => {
                console.error('Eroare la încărcarea cererilor:', err);
                this.loading.set(false);
                this.snackBar.open('Eroare la încărcarea cererilor.', 'Închide', { duration: 4000 });
            }
        });
    }

    resetFilters(): void {
        this.filterStatus.set('');
        this.filterDepartmentId.set('');
        this.filterLeaveTypeId.set('');
        this.filterEmployeeId.set('');
        this.filterStartDate.set('');
        this.filterEndDate.set('');
    }

    loadAttachments(): void {
        this.attachmentService.getAll().subscribe({
            next: (attachments) => {
                const map: Record<number, Attachment> = {};
                for (const a of attachments) {
                    map[a.leaveRequest.leaveRequestId] = a;
                }
                this.attachments.set(map);
            },
            error: (err) => console.error('Eroare la încărcarea documentelor:', err)
        });
    }
    approve(request: LeaveRequest): void {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: {
                title: 'Aprobă cererea',
                message: `Aprobi cererea de ${request.leaveType.name} a lui ${request.employee.name} (${request.startDate} - ${request.endDate})?`,
                confirmLabel: 'Aprobă',
                danger: false
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;

            this.processingId.set(request.leaveRequestId);

            this.leaveRequestService.updateStatus(request.leaveRequestId, { status: 'APPROVED' }).subscribe({
                next: (result) => {
                    this.processingId.set(null);
                    if (result.warning) {
                        this.snackBar.open(result.warning, 'Închide', { duration: 8000 });
                    } else {
                        this.snackBar.open('Cerere aprobată cu succes.', 'Închide', { duration: 3000 });
                    }
                    this.loadRequests();
                },
                error: (err) => {
                    this.processingId.set(null);
                    const message = err.error?.error || 'A apărut o eroare la aprobarea cererii.';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    reject(request: LeaveRequest): void {
        const dialogRef = this.dialog.open(RejectDialog, { width: '450px' });

        dialogRef.afterClosed().subscribe((comment: string | null) => {
            if (!comment) return;

            this.processingId.set(request.leaveRequestId);

            this.leaveRequestService.updateStatus(request.leaveRequestId, { status: 'REJECTED', comment }).subscribe({
                next: () => {
                    this.processingId.set(null);
                    this.snackBar.open('Cerere respinsă.', 'Închide', { duration: 3000 });
                    this.loadRequests();
                },
                error: (err) => {
                    this.processingId.set(null);
                    const message = err.error?.error || 'A apărut o eroare la respingerea cererii.';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
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

    hasAttachment(requestId: number): boolean {
        return !!this.attachments()[requestId];
    }

    downloadAttachment(request: LeaveRequest): void {
        const attachment = this.attachments()[request.leaveRequestId];
        if (!attachment) return;

        this.attachmentService.download(attachment.attachmentId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = attachment.fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => this.snackBar.open('Nu s-a putut descărca documentul.', 'Închide', { duration: 4000 })
        });
    }
}