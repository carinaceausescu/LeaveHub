import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';
import { LeaveRequestService } from '../../../core/services/leave-request.service';
import { DepartmentService } from '../../../core/services/department.service';
import { LeaveRequest } from '../../../core/models/leave-request.model';
import { Department } from '../../../core/models/employee.model';

interface DayCell {
    date: Date;
    dayNumber: number;
    inCurrentMonth: boolean;
    absentEmployees: { name: string; leaveTypeName: string }[];
    isOverLimit: boolean;
}

@Component({
    selector: 'app-department-calendar',
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.css',
})
export class DepartmentCalendar implements OnInit {
    private authService = inject(AuthService);
    private leaveRequestService = inject(LeaveRequestService);
    private departmentService = inject(DepartmentService);

    departments = signal<Department[]>([]);
    selectedDepartmentId = signal<number | null>(null);
    currentMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    allApprovedRequests = signal<LeaveRequest[]>([]);
    loading = signal(true);

    weekDays = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa', 'Du'];

    monthLabel = computed(() =>
        this.currentMonth().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
    );

    maxAbsent = computed(() => {
        const dept = this.departments().find(d => d.deptId === this.selectedDepartmentId());
        return dept?.maxAbsentEmployees ?? null;
    });

    calendarDays = computed<DayCell[]>(() => {
        const month = this.currentMonth();
        const year = month.getFullYear();
        const monthIndex = month.getMonth();

        const firstOfMonth = new Date(year, monthIndex, 1);
        const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
        const startDate = new Date(year, monthIndex, 1 - firstWeekday);

        const deptId = this.selectedDepartmentId();
        const requests = this.allApprovedRequests().filter(r => r.employee?.department?.deptId === deptId);
        const max = this.maxAbsent();

        const days: DayCell[] = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = this.toIsoDate(date);

            const absentEmployees = requests
                .filter(r => r.startDate <= dateStr && r.endDate >= dateStr)
                .map(r => ({ name: r.employee.name, leaveTypeName: r.leaveType.name }));

            days.push({
                date,
                dayNumber: date.getDate(),
                inCurrentMonth: date.getMonth() === monthIndex,
                absentEmployees,
                isOverLimit: max != null && absentEmployees.length > max
            });
        }

        return days;
    });

    ngOnInit(): void {
        this.loadDepartments();
        this.loadApprovedRequests();
    }

    loadDepartments(): void {
        this.departmentService.getAll().subscribe({
            next: (depts) => {
                this.departments.set(depts);
                const user = this.authService.currentUser();
                const defaultDept = this.authService.isManager()
                    ? depts.find(d => d.deptId === user?.departmentId)?.deptId
                    : depts[0]?.deptId;
                this.selectedDepartmentId.set(defaultDept ?? null);
            },
            error: (err) => console.error('Eroare la încărcarea departamentelor:', err)
        });
    }

    loadApprovedRequests(): void {
        this.loading.set(true);
        this.leaveRequestService.search({ status: 'APPROVED' }).subscribe({
            next: (requests) => {
                this.allApprovedRequests.set(requests);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Eroare la încărcarea cererilor:', err);
                this.loading.set(false);
            }
        });
    }

    previousMonth(): void {
        const m = this.currentMonth();
        this.currentMonth.set(new Date(m.getFullYear(), m.getMonth() - 1, 1));
    }

    nextMonth(): void {
        const m = this.currentMonth();
        this.currentMonth.set(new Date(m.getFullYear(), m.getMonth() + 1, 1));
    }

    onDepartmentChange(deptId: number): void {
        this.selectedDepartmentId.set(deptId);
    }

    isToday(date: Date): boolean {
        return date.toDateString() === new Date().toDateString();
    }

    private toIsoDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}