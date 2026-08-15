import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LeaveType } from '../../../core/models/leave-request.model';

export interface LeaveTypeFormDialogData {
    leaveType: LeaveType | null;
}

@Component({
    selector: 'app-leave-type-form-dialog',
    imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule],
    templateUrl: './leave-type-form-dialog.html',
    styleUrl: './leave-type-form-dialog.css',
})
export class LeaveTypeFormDialog {
    private dialogRef = inject(MatDialogRef<LeaveTypeFormDialog>);
    data = inject<LeaveTypeFormDialogData>(MAT_DIALOG_DATA);

    isEdit = !!this.data.leaveType;

    name = signal(this.data.leaveType?.name ?? '');
    code = signal(this.data.leaveType?.code ?? '');
    requiresAttachment = signal(this.data.leaveType?.requiresAttachment ?? false);
    paid = signal(this.data.leaveType?.paid ?? true);

    save(): void {
        if (!this.name().trim() || !this.code().trim()) {
            return;
        }

        this.dialogRef.close({
            name: this.name().trim(),
            code: this.code().trim().toUpperCase(),
            requiresAttachment: this.requiresAttachment(),
            paid: this.paid()
        });
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}