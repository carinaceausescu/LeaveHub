import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { LeaveTypeService } from '../../../core/services/leave-type.service';
import { AttachmentService } from '../../../core/services/attachment.service';
import { LeaveType } from '../../../core/models/leave-request.model';

@Component({
    selector: 'app-new-request',
    imports: [
        CommonModule, FormsModule, MatFormFieldModule, MatSelectModule,
        MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule
    ],
    templateUrl: './new-request.html',
    styleUrl: './new-request.css',
})
export class NewRequest implements OnInit {
    private authService = inject(AuthService);
    private leaveRequestService = inject(LeaveRequestService);
    private leaveTypeService = inject(LeaveTypeService);
    private attachmentService = inject(AttachmentService);
    private router = inject(Router);

    leaveTypes = signal<LeaveType[]>([]);
    selectedLeaveTypeId = signal<number | null>(null);
    startDate = signal<Date | null>(null);
    endDate = signal<Date | null>(null);
    selectedFile = signal<File | null>(null);
    submitting = signal(false);
    errorMessage = signal<string | null>(null);

    selectedLeaveType(): LeaveType | undefined {
        return this.leaveTypes().find(lt => lt.leaveTypeId === this.selectedLeaveTypeId());
    }

    requiresAttachment(): boolean {
        return this.selectedLeaveType()?.requiresAttachment ?? false;
    }

    ngOnInit(): void {
        this.leaveTypeService.getAll().subscribe({
            next: (types) => this.leaveTypes.set(types),
            error: (err) => console.error('Eroare la încărcarea tipurilor de concediu:', err)
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile.set(input.files?.[0] ?? null);
    }

    private toIsoDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    submit(): void {
        this.errorMessage.set(null);

        const employeeId = this.authService.currentUser()?.emplId;
        const leaveTypeId = this.selectedLeaveTypeId();
        const start = this.startDate();
        const end = this.endDate();

        if (!employeeId || !leaveTypeId || !start || !end) {
            this.errorMessage.set('Completează toate câmpurile obligatorii.');
            return;
        }

        if (this.requiresAttachment() && !this.selectedFile()) {
            this.errorMessage.set('Acest tip de concediu necesită un document atașat.');
            return;
        }

        this.submitting.set(true);

        this.leaveRequestService.create({
            employee: { emplId: employeeId },
            leaveType: { leaveTypeId },
            startDate: this.toIsoDate(start),
            endDate: this.toIsoDate(end)
        }).subscribe({
            next: (createdRequest) => {
                const file = this.selectedFile();
                if (file) {
                    this.attachmentService.upload(file, createdRequest.leaveRequestId).subscribe({
                        next: () => {
                            this.submitting.set(false);
                            this.router.navigate(['/requests/mine']);
                        },
                        error: (err) => {
                            this.submitting.set(false);
                            this.errorMessage.set('Cererea a fost creată, dar atașamentul nu s-a putut încărca. Îl poți adăuga ulterior.');
                            console.error(err);
                        }
                    });
                } else {
                    this.submitting.set(false);
                    this.router.navigate(['/requests/mine']);
                }
            },
            error: (err) => {
                this.submitting.set(false);
                const message = err.error?.error || 'A apărut o eroare la crearea cererii.';
                this.errorMessage.set(message);
            }
        });
    }
}