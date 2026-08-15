import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatTableModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
    private authService = inject(AuthService);
    private leaveRequestService = inject(LeaveRequestService);

    currentUser = this.authService.currentUser;
    myRequests = signal<LeaveRequest[]>([]);

    displayedColumns = ['leaveType', 'period', 'days', 'status'];

    pendingCount = computed(() =>
        this.myRequests().filter(r => r.status === 'PENDING').length
    );

    approvedCount = computed(() =>
        this.myRequests().filter(r => r.status === 'APPROVED').length
    );

    consumedDays = computed(() => {
        const available = this.currentUser()?.availableLeaveDays ?? 0;
        const annual = this.currentUser()?.annualLeaveDays ?? 0;
        return annual - available;
    });

    ngOnInit(): void {
        this.leaveRequestService.getAll().subscribe({
        next: (requests) => {
            const userId = this.currentUser()?.emplId;
            const filtered = requests.filter(r => r.employee?.emplId === userId);
            this.myRequests.set(filtered);
        },
        error: (err) => console.error('Eroare la încărcarea cererilor:', err)
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
}