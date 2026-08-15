import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { LeaveTypeService } from '../../../core/services/leave-type.service';
import { Employee, Department } from '../../../core/models/employee.model';
import { LeaveType } from '../../../core/models/leave-request.model';
import { EmployeeFormDialog } from '../../../shared/dialogs/employee-form-dialog/employee-form-dialog';
import { DepartmentFormDialog } from '../../../shared/dialogs/department-form-dialog/department-form-dialog';
import { LeaveTypeFormDialog } from '../../../shared/dialogs/leave-type-form-dialog/leave-type-form-dialog';
import { ConfirmDialog } from '../../../shared/dialogs/confirm-dialog/confirm-dialog';
import { ReportService } from '../../../core/services/report.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';

@Component({
    selector: 'app-admin-panel',
    imports: [CommonModule, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule],
    templateUrl: './panel.html',
    styleUrl: './panel.css',
})
export class AdminPanel implements OnInit {
    private employeeService = inject(EmployeeService);
    private departmentService = inject(DepartmentService);
    private leaveTypeService = inject(LeaveTypeService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private reportService = inject(ReportService);
    private leaveRequestService = inject(LeaveRequestService);

    employees = signal<Employee[]>([]);
    departments = signal<Department[]>([]);
    leaveTypes = signal<LeaveType[]>([]);
    allRequests = signal<LeaveRequest[]>([]);

    employeeColumns = ['name', 'email', 'role', 'department', 'availableLeaveDays', 'actions'];
    departmentColumns = ['departmentName', 'maxAbsentEmployees', 'actions'];
    leaveTypeColumns = ['name', 'code', 'requiresAttachment', 'paid', 'actions'];

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
    this.employeeService.getAll().subscribe({
        next: (data) => this.employees.set(data),
        error: (err) => console.error(err)
    });
    this.departmentService.getAll().subscribe({
        next: (data) => this.departments.set(data),
        error: (err) => console.error(err)
    });
    this.leaveTypeService.getAll().subscribe({
        next: (data) => this.leaveTypes.set(data),
        error: (err) => console.error(err)
    });
    this.leaveRequestService.getAll().subscribe({
        next: (data) => this.allRequests.set(data),
        error: (err) => console.error(err)
    });
}

    openEmployeeForm(employee: Employee | null): void {
        const dialogRef = this.dialog.open(EmployeeFormDialog, {
            width: '450px',
            data: { employee, departments: this.departments() }
        });

        dialogRef.afterClosed().subscribe((payload) => {
            if (!payload) return;

            const request$ = employee
                ? this.employeeService.update(employee.emplId, payload)
                : this.employeeService.create(payload);

            request$.subscribe({
                next: () => {
                    this.snackBar.open('Angajat salvat cu succes.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Eroare la salvarea angajatului.';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    deleteEmployee(employee: Employee): void {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: {
                title: 'Șterge angajat',
                message: `Sigur ștergi angajatul ${employee.name}? Această acțiune este ireversibilă.`,
                confirmLabel: 'Șterge',
                danger: true
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;

            this.employeeService.delete(employee.emplId).subscribe({
                next: () => {
                    this.snackBar.open('Angajat șters.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Nu s-a putut șterge angajatul (poate are cereri asociate).';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    openDepartmentForm(department: Department | null): void {
        const dialogRef = this.dialog.open(DepartmentFormDialog, {
            width: '400px',
            data: { department }
        });

        dialogRef.afterClosed().subscribe((payload) => {
            if (!payload) return;

            const request$ = department
                ? this.departmentService.update(department.deptId, payload)
                : this.departmentService.create(payload);

            request$.subscribe({
                next: () => {
                    this.snackBar.open('Departament salvat cu succes.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Eroare la salvarea departamentului.';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    deleteDepartment(department: Department): void {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: {
                title: 'Șterge departament',
                message: `Sigur ștergi departamentul ${department.departmentName}?`,
                confirmLabel: 'Șterge',
                danger: true
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;

            this.departmentService.delete(department.deptId).subscribe({
                next: () => {
                    this.snackBar.open('Departament șters.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Nu s-a putut șterge departamentul (poate are angajați asociați).';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    openLeaveTypeForm(leaveType: LeaveType | null): void {
        const dialogRef = this.dialog.open(LeaveTypeFormDialog, {
            width: '400px',
            data: { leaveType }
        });

        dialogRef.afterClosed().subscribe((payload) => {
            if (!payload) return;

            const request$ = leaveType
                ? this.leaveTypeService.update(leaveType.leaveTypeId, payload)
                : this.leaveTypeService.create(payload);

            request$.subscribe({
                next: () => {
                    this.snackBar.open('Tip concediu salvat cu succes.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Eroare la salvarea tipului de concediu.';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    deleteLeaveType(leaveType: LeaveType): void {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: {
                title: 'Șterge tip concediu',
                message: `Sigur ștergi tipul de concediu ${leaveType.name}?`,
                confirmLabel: 'Șterge',
                danger: true
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (!confirmed) return;

            this.leaveTypeService.delete(leaveType.leaveTypeId).subscribe({
                next: () => {
                    this.snackBar.open('Tip de concediu șters.', 'Închide', { duration: 3000 });
                    this.loadAll();
                },
                error: (err) => {
                    const message = err.error?.error || 'Nu s-a putut șterge tipul de concediu (poate are cereri asociate).';
                    this.snackBar.open(message, 'Închide', { duration: 5000 });
                }
            });
        });
    }

    downloadPendingRequestsReport(): void {
        this.reportService.downloadPendingRequests().subscribe({
            next: (blob) => this.saveBlob(blob, 'cereri_in_asteptare.pdf'),
            error: () => this.snackBar.open('Nu s-a putut genera raportul.', 'Închide', { duration: 4000 })
        });
    }

    downloadDepartmentBalanceReport(): void {
        this.reportService.downloadDepartmentBalance().subscribe({
            next: (blob) => this.saveBlob(blob, 'sold_per_departament.pdf'),
            error: () => this.snackBar.open('Nu s-a putut genera raportul.', 'Închide', { duration: 4000 })
        });
    }

    downloadLeaveUsageReport(): void {
        this.reportService.downloadLeaveUsage().subscribe({
            next: (blob) => this.saveBlob(blob, 'utilizare_concedii.pdf'),
            error: () => this.snackBar.open('Nu s-a putut genera raportul.', 'Închide', { duration: 4000 })
        });
    }

    private saveBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    totalRequests = computed(() => this.allRequests().length);

    approvedCount = computed(() =>
        this.allRequests().filter(r => r.status === 'APPROVED').length
    );

    pendingCount = computed(() =>
        this.allRequests().filter(r => r.status === 'PENDING').length
    );

    totalDaysConsumed = computed(() =>
        this.allRequests()
            .filter(r => r.status === 'APPROVED')
            .reduce((sum, r) => sum + r.workingDays, 0)
    );

    departmentStats = computed(() => {
        const requests = this.allRequests();
        const employees = this.employees();
        const departments = this.departments();

        return departments.map(dept => {
            const deptEmployees = employees.filter(e => e.department?.deptId === dept.deptId);
            const deptRequests = requests.filter(r => r.employee?.department?.deptId === dept.deptId);
            const approvedDays = deptRequests
                .filter(r => r.status === 'APPROVED')
                .reduce((sum, r) => sum + r.workingDays, 0);

            const totalAllocated = deptEmployees.reduce((sum, e) => sum + e.annualLeaveDays, 0);
            const occupancyRate = totalAllocated > 0 ? Math.round((approvedDays / totalAllocated) * 100) : 0;

            return {
                departmentName: dept.departmentName,
                requestCount: deptRequests.length,
                approvedDays,
                occupancyRate
            };
        });
    });
}