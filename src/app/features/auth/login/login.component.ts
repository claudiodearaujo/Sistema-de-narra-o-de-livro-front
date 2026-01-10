import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/auth/services/auth.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

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
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '/social/feed';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private analytics: AnalyticsService,
    private messageService: MessageService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/social/feed';
  }

  ngOnInit(): void {
    // Listen for autofill events on the form
    this.setupAutofillDetection();
  }

  ngAfterViewInit(): void {
    // Additional check for browser autofill after view initialization
    setTimeout(() => this.checkForAutofill(), 100);
  }

  /**
   * Setup detection for browser autofill
   * Browsers may fill fields without triggering Angular's change detection
   */
  private setupAutofillDetection(): void {
    // Check periodically for autofilled values (covers Chrome, Firefox, Safari)
    const checkInterval = setInterval(() => {
      this.checkForAutofill();
    }, 500);

    // Stop checking after 3 seconds
    setTimeout(() => clearInterval(checkInterval), 3000);
  }

  /**
   * Check if fields were autofilled and sync with form
   */
  private checkForAutofill(): void {
    const emailEl = document.querySelector<HTMLInputElement>('input[formcontrolname="email"]');
    const passwordEl = document.querySelector<HTMLInputElement>('input[type="password"]');

    if (emailEl && emailEl.value && this.loginForm.get('email')?.value !== emailEl.value) {
      this.ngZone.run(() => {
        this.loginForm.patchValue({ email: emailEl.value }, { emitEvent: true });
      });
    }

    if (passwordEl && passwordEl.value && this.loginForm.get('password')?.value !== passwordEl.value) {
      this.ngZone.run(() => {
        this.loginForm.patchValue({ password: passwordEl.value }, { emitEvent: true });
      });
    }
  }

  /**
   * Handle input event to sync autofilled values
   */
  onInputChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value !== this.loginForm.get(field)?.value) {
      this.loginForm.patchValue({ [field]: input.value });
    }
  }

  get isLoading() {
    return this.authService.isLoading();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(event?: Event): void {
    // Prevent default form submission to avoid page refresh
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Check for autofilled values before validation
    this.checkForAutofill();

    // Small delay to ensure autofill values are synced
    setTimeout(() => {
      this.processLogin();
    }, 50);
  }

  private processLogin(): void {
    // Re-check autofill one more time
    this.checkForAutofill();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      // Show specific validation errors via toast
      const errors = this.getValidationErrors();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: errors.join('. '),
        life: 5000
      });
      return;
    }

    this.errorMessage = null;
    console.log('[LoginComponent] Submitting login...');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Track successful login
        this.analytics.trackLogin('email');

        console.log('[LoginComponent] Login success, response:', response);
        console.log('[LoginComponent] Token saved:', this.authService.getToken());
        console.log('[LoginComponent] Is authenticated:', this.authService.isAuthenticated());
        console.log('[LoginComponent] Navigating to:', this.returnUrl);

        this.messageService.add({
          severity: 'success',
          summary: 'Login realizado!',
          detail: 'Bem-vindo de volta!',
          life: 2000
        });


        // Force navigation after authentication
        setTimeout(() => {
          this.router.navigate([this.returnUrl], { replaceUrl: true }).then(
            (success) => {
              console.log('[LoginComponent] Navigation success:', success);
              if (!success) {
                // Fallback: try window.location
                console.log('[LoginComponent] Navigation failed, trying fallback...');
                window.location.href = this.returnUrl;
              }
            },
            (error) => console.error('[LoginComponent] Navigation error:', error)
          );
        }, 500);
      },
      error: (error) => {
        console.error('[LoginComponent] Login error:', error);
        this.analytics.trackError('login_error', error.message || 'Login failed', 'login');
        this.errorMessage = error.message;

        // Show error via toast for better visibility
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no login',
          detail: error.message || 'Não foi possível realizar o login. Verifique suas credenciais.',
          life: 6000
        });
      }
    });
  }

  /**
   * Get validation error messages for the form
   */
  private getValidationErrors(): string[] {
    const errors: string[] = [];

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl?.errors) {
      if (emailControl.errors['required']) {
        errors.push('E-mail é obrigatório');
      } else if (emailControl.errors['email']) {
        errors.push('E-mail inválido');
      }
    }

    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        errors.push('Senha é obrigatória');
      } else if (passwordControl.errors['minlength']) {
        errors.push('Senha deve ter no mínimo 6 caracteres');
      }
    }

    return errors.length > 0 ? errors : ['Por favor, preencha todos os campos corretamente'];
  }
}
