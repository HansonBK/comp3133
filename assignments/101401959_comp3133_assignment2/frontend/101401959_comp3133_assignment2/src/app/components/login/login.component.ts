import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <section class="auth-page">
      <div class="auth-panel auth-panel--hero">
        <p class="eyebrow">Assignment 2</p>
        <h1>Employee Management Portal</h1>
        <p class="lead">Secure Angular frontend connected to your GraphQL employee management backend.</p>
        <ul class="feature-list">
          <li>Login and signup with validation</li>
          <li>Protected employee management screens</li>
          <li>CRUD, search, upload, and responsive UI</li>
        </ul>
      </div>

      <div class="auth-panel auth-panel--form">
        <p class="eyebrow">Welcome back</p>
        <h2>Login</h2>
        <p class="muted-copy">Use your username or email and password to continue.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <label>
            Username or Email
            <input appAutofocus type="text" formControlName="usernameOrEmail" placeholder="Enter username or email" />
          </label>
          <p class="field-error" *ngIf="submitted && form.controls.usernameOrEmail.invalid">Username or email is required.</p>

          <label>
            Password
            <input type="password" formControlName="password" placeholder="Enter password" />
          </label>
          <p class="field-error" *ngIf="submitted && form.controls.password.invalid">Password is required.</p>

          <p class="feedback feedback--error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button type="submit" class="btn btn--primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account?
          <a routerLink="/signup">Create one here</a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      padding: 32px;
      gap: 24px;
    }

    .auth-panel {
      background: rgba(255, 253, 248, 0.88);
      border: 1px solid var(--line);
      border-radius: 28px;
      box-shadow: var(--shadow);
      padding: 40px;
    }

    .auth-panel--hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background:
        linear-gradient(135deg, rgba(15, 118, 110, 0.92), rgba(17, 94, 89, 0.92)),
        linear-gradient(180deg, #0f766e, #115e59);
      color: #f8fafc;
    }

    .auth-panel--form {
      align-self: center;
      max-width: 560px;
      width: 100%;
      margin-left: auto;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 12px;
      color: inherit;
      opacity: 0.85;
    }

    h1,
    h2 {
      margin: 0 0 12px;
      line-height: 1;
    }

    h1 {
      font-size: clamp(40px, 6vw, 68px);
    }

    h2 {
      font-size: 42px;
    }

    .lead,
    .muted-copy {
      color: var(--muted);
      font-size: 18px;
      line-height: 1.6;
    }

    .auth-panel--hero .lead {
      color: rgba(255, 255, 255, 0.88);
      max-width: 520px;
    }

    .feature-list {
      margin: 28px 0 0;
      padding-left: 20px;
      display: grid;
      gap: 10px;
      font-size: 17px;
    }

    .auth-form {
      display: grid;
      gap: 14px;
      margin-top: 24px;
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
      transition: transform 0.18s ease, opacity 0.18s ease;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
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

    .auth-switch {
      margin: 20px 0 0;
      color: var(--muted);
    }

    .auth-switch a {
      color: var(--accent-strong);
      font-weight: 700;
      text-decoration: none;
    }

    @media (max-width: 960px) {
      .auth-page {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .auth-panel--form {
        margin-left: 0;
      }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    usernameOrEmail: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  submitted = false;
  errorMessage = '';

  submit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { usernameOrEmail, password } = this.form.getRawValue();

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.success || !response.token) {
          this.errorMessage = response.message;
          return;
        }

        this.authService.storeSession(response.token, response.user);
        void this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to login right now.';
      }
    });
  }
}
