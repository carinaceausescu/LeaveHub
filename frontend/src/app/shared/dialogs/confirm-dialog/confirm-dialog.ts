import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}

@Component({
    selector: 'app-confirm-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
    private dialogRef = inject(MatDialogRef<ConfirmDialog>);
    data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    confirm(): void {
        this.dialogRef.close(true);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
}