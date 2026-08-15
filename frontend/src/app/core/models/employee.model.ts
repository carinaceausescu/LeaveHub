export interface Department {
    deptId: number;
    departmentName: string;
    manager?: Employee;
    maxAbsentEmployees: number;
}

export interface Employee {
    emplId: number;
    name: string;
    email: string;
    role: string;
    department?: Department;
    annualLeaveDays: number;
    availableLeaveDays: number;
}