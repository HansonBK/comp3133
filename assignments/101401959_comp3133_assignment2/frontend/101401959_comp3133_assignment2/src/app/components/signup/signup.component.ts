import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page auth-page--signup">
      <div class="auth-card">
        <p class="eyebrow">New account</p>
        <h1>Create your account</h1>
        <p class="muted-copy">Finish signup to unlock the employee dashboard, employee CRUD, search, and image upload flow.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <label>
            Username
            <input type="text" formControlName="username" placeholder="Choose a username" />
          </label>
          <p class="field-error" *ngIf="submitted && form.controls.username.invalid">Username is required.</p>

          <label>
            Email
            <input type="email" formControlName="email" placeholder="Enter email address" />
          </label>
          <p class="field-error" *ngIf="submitted && form.controls.email.invalid">Enter a valid email address.</p>

          <label>
            Password
            <input type="password" formControlName="password" placeholder="Minimum 6 characters" />
          </label>
          <p class="field-error" *ngIf="submitted && form.controls.password.invalid">Password must be at least 6 characters.</p>

          <label>
            Confirm Password
            <input type="password" formControlName="confirmPassword" placeholder="Re-enter password" />
          </label>
          <p class="field-error" *ngIf="submitted && form.hasError('passwordMismatch')">Passwords must match.</p>

          <p class="feedback feedback--error" *ngIf="errorMessage">{{ errorMessage }}</p>
          <p class="feedback feedback--success" *ngIf="successMessage">{{ successMessage }}</p>

          <button type="submit" class="btn btn--primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Signup' }}
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <a routerLink="/login">Back to login</a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .auth-card {
      width: min(720px, 100%);
      background: rgba(255, 253, 248, 0.92);
      border: 1px solid var(--line);
      border-radius: 28px;
      box-shadow: var(--shadow);
      padding: 42px;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 12px;
      color: var(--accent-strong);
    }

    h1 {
      margin: 0 0 12px;
      font-size: clamp(36px, 5vw, 54px);
      line-height: 1;
    }

    .muted-copy {
      color: var(--muted);
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 22px;
    }

    .auth-form {
      display: grid;
      gap: 14px;
    }

    label {
      display: grid;
      gap: 8px;
      font-weight: 600;
    }

    input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px 16px;
      background: #fff;
    }

    input:focus {
      outline: 2px solid rgba(15, 118, 110, 0.24);
      border-color: var(--accent);
    }

    .btn {
      border: 0;
      border-radius: 999px;
      padding: 14px 22px;
      cursor: pointer;
    }

    .btn--primary {
      background: var(--accent);
      color: #fff;
      font-weight: 700;
    }

    .field-error,
    .feedback {
      margin: -2px 0 0;
      font-size: 14px;
    }

    .field-error,
    .feedback--error {
      color: var(--danger);
    }

    .feedback--success {
      color: var(--accent-strong);
    }

    .auth-switch {
      margin: 20px 0 0;
      color: var(--muted);
    }

    .auth-switch a {
      color: var(--accent-strong);
      font-weight: 700;
      text-decoration: none;
    }
  `]
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPasswords });

  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  submit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { username, email, password } = this.form.getRawValue();

    this.authService.signup(username ?? '', email ?? '', password ?? '').subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.success || !response.token) {
          this.errorMessage = response.message;
          return;
        }

        this.authService.storeSession(response.token, response.user);
        this.successMessage = 'Signup successful. Redirecting to employee dashboard...';
        setTimeout(() => void this.router.navigate(['/employees']), 700);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to create account right now.';
      }
    });
  }

  private matchPasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
