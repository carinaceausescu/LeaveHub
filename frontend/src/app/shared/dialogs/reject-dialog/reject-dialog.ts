import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-reject-dialog',
    imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
    templateUrl: './reject-dialog.html',
    styleUrl: './reject-dialog.css',
})
export class RejectDialog {
    private dialogRef = inject(MatDialogRef<RejectDialog>);

    comment = signal('');
    touched = signal(false);

    get hasError(): boolean {
        return this.touched() && this.comment().trim() === '';
    }

    confirm(): void {
        this.touched.set(true);
        if (this.comment().trim() === '') {
            return;
        }
        this.dialogRef.close(this.comment().trim());
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}