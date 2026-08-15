import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface InfoDialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-info-dialog',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './info-dialog.html',
    styleUrl: './info-dialog.css',
})
export class InfoDialog {
    private dialogRef = inject(MatDialogRef<InfoDialog>);
    data = inject<InfoDialogData>(MAT_DIALOG_DATA);

    close(): void {
        this.dialogRef.close();
    }
}