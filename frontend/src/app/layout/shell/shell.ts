import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-shell',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
    templateUrl: './shell.html',
    styleUrl: './shell.css',
})
export class Shell {
    authService = inject(AuthService);
    private router = inject(Router);

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}