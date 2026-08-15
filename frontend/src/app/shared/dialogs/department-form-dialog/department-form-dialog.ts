import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Department } from '../../../core/models/employee.model';

export interface DepartmentFormDialogData {
    department: Department | null;
}

@Component({
    selector: 'app-department-form-dialog',
    imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    templateUrl: './department-form-dialog.html',
    styleUrl: './department-form-dialog.css',
})
export class DepartmentFormDialog {
    private dialogRef = inject(MatDialogRef<DepartmentFormDialog>);
    data = inject<DepartmentFormDialogData>(MAT_DIALOG_DATA);

    isEdit = !!this.data.department;

    departmentName = signal(this.data.department?.departmentName ?? '');
    maxAbsentEmployees = signal(this.data.department?.maxAbsentEmployees ?? 1);

    save(): void {
        if (!this.departmentName().trim()) {
            return;
        }

        this.dialogRef.close({
            departmentName: this.departmentName().trim(),
            maxAbsentEmployees: this.maxAbsentEmployees(),
            manager: this.data.department?.manager ?? null
        });
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}