import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee, Department } from '../../../core/models/employee.model';

export interface EmployeeFormDialogData {
    employee: Employee | null;
    departments: Department[];
}

@Component({
    selector: 'app-employee-form-dialog',
    imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    templateUrl: './employee-form-dialog.html',
    styleUrl: './employee-form-dialog.css',
})
export class EmployeeFormDialog {
    private dialogRef = inject(MatDialogRef<EmployeeFormDialog>);
    data = inject<EmployeeFormDialogData>(MAT_DIALOG_DATA);

    isEdit = !!this.data.employee;

    name = signal(this.data.employee?.name ?? '');
    email = signal(this.data.employee?.email ?? '');
    role = signal(this.data.employee?.role ?? 'User');
    password = signal('');
    departmentId = signal<number | null>(this.data.employee?.department?.deptId ?? null);
    annualLeaveDays = signal(this.data.employee?.annualLeaveDays ?? 21);
    availableLeaveDays = signal(this.data.employee?.availableLeaveDays ?? 21);

    save(): void {
        if (!this.name().trim() || !this.email().trim()) {
            return;
        }

        if (!this.isEdit && !this.password().trim()) {
            return;
        }

        const payload: any = {
            name: this.name().trim(),
            email: this.email().trim(),
            role: this.role(),
            department: this.departmentId() ? { deptId: this.departmentId() } : null,
            annualLeaveDays: this.annualLeaveDays(),
            availableLeaveDays: this.availableLeaveDays()
        };

        if (this.password().trim()) {
            payload.password = this.password().trim();
        }

        this.dialogRef.close(payload);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}