import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    MessageModule,
    CardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '/writer';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/writer';
  }

  get isLoading() {
    return this.authService.isLoading();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    console.log('[LoginComponent] Submitting login...');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('[LoginComponent] Login success, response:', response);
        console.log('[LoginComponent] Token saved:', this.authService.getToken());
        console.log('[LoginComponent] Is authenticated:', this.authService.isAuthenticated());
        console.log('[LoginComponent] Navigating to:', this.returnUrl);
        
        // Use setTimeout to ensure Angular's change detection has completed
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl).then(
            (success) => console.log('[LoginComponent] Navigation success:', success),
            (error) => console.error('[LoginComponent] Navigation error:', error)
          );
        }, 100);
      },
      error: (error) => {
        console.error('[LoginComponent] Login error:', error);
        this.errorMessage = error.message;
      }
    });
  }
}
