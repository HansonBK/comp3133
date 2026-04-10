import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="page-shell">
      <div class="page-header">
        <div>
          <p class="eyebrow">{{ isEditMode ? 'Update employee' : 'Create employee' }}</p>
          <h1>{{ isEditMode ? 'Edit Employee Record' : 'Add New Employee' }}</h1>
          <p class="subhead">Complete every required field, upload a profile picture, and submit the employee data through GraphQL.</p>
        </div>
        <a routerLink="/employees" class="btn btn--secondary">Back to List</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-card">
        <div class="grid">
          <label>
            First Name
            <input type="text" formControlName="first_name" />
          </label>

          <label>
            Last Name
            <input type="text" formControlName="last_name" />
          </label>

          <label>
            Email
            <input type="email" formControlName="email" />
          </label>

          <label>
            Gender
            <select formControlName="gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Position
            <input type="text" formControlName="designation" />
          </label>

          <label>
            Department
            <input type="text" formControlName="department" />
          </label>

          <label>
            Salary
            <input type="number" formControlName="salary" min="1000" />
          </label>

          <label>
            Date of Joining
            <input type="date" formControlName="date_of_joining" />
          </label>
        </div>

        <div class="upload-card">
          <div>
            <h2>Profile Photo</h2>
            <p class="muted-copy">Upload a photo to the backend REST endpoint before saving the employee record.</p>
          </div>
          <input type="file" accept="image/*" (change)="onFileSelected($event)" />
          <p class="feedback feedback--success" *ngIf="uploadMessage">{{ uploadMessage }}</p>
          <p class="feedback feedback--error" *ngIf="uploadError">{{ uploadError }}</p>
          <img *ngIf="form.value.employee_photo" [src]="form.value.employee_photo || ''" alt="Employee preview" class="preview" />
        </div>

        <div class="validation-grid" *ngIf="submitted && form.invalid">
          <p class="field-error" *ngIf="controlInvalid('first_name')">First name is required.</p>
          <p class="field-error" *ngIf="controlInvalid('last_name')">Last name is required.</p>
          <p class="field-error" *ngIf="controlInvalid('email')">Enter a valid email address.</p>
          <p class="field-error" *ngIf="controlInvalid('designation')">Position is required.</p>
          <p class="field-error" *ngIf="controlInvalid('department')">Department is required.</p>
          <p class="field-error" *ngIf="controlInvalid('salary')">Salary must be at least 1000.</p>
          <p class="field-error" *ngIf="controlInvalid('date_of_joining')">Date of joining is required.</p>
        </div>

        <p class="feedback feedback--error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="feedback feedback--success" *ngIf="successMessage">{{ successMessage }}</p>

        <div class="actions">
          <button type="submit" class="btn btn--primary" [disabled]="saving || uploading">
            {{ saving ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Save Employee') }}
          </button>
          <a routerLink="/employees" class="btn btn--secondary">Cancel</a>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .page-shell {
      padding: 24px;
      display: grid;
      gap: 20px;
    }

    .page-header,
    .form-card {
      background: rgba(255, 253, 248, 0.92);
      border: 1px solid var(--line);
      border-radius: 26px;
      box-shadow: var(--shadow);
    }

    .page-header {
      padding: 28px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 12px;
      color: var(--accent-strong);
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      margin-bottom: 10px;
      font-size: clamp(30px, 4.6vw, 48px);
    }

    .subhead,
    .muted-copy {
      color: var(--muted);
      line-height: 1.6;
    }

    .form-card {
      padding: 24px;
      display: grid;
      gap: 24px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    label {
      display: grid;
      gap: 8px;
      font-weight: 600;
    }

    input,
    select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 13px 14px;
      background: #fff;
    }

    .upload-card {
      border: 1px dashed var(--line);
      border-radius: 22px;
      padding: 20px;
      display: grid;
      gap: 14px;
      background: #fff;
    }

    .preview {
      width: 130px;
      height: 130px;
      border-radius: 24px;
      object-fit: cover;
      border: 1px solid var(--line);
    }

    .validation-grid {
      display: grid;
      gap: 8px;
    }

    .field-error,
    .feedback {
      font-size: 14px;
    }

    .field-error,
    .feedback--error {
      color: var(--danger);
    }

    .feedback--success {
      color: var(--accent-strong);
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      border: 0;
      border-radius: 999px;
      padding: 12px 18px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn--primary {
      background: var(--accent);
      color: #fff;
      font-weight: 700;
    }

    .btn--secondary {
      background: #fff;
      color: var(--ink);
      border: 1px solid var(--line);
    }

    @media (max-width: 820px) {
      .page-shell {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly uploadService = inject(UploadService);

  readonly form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['Other', Validators.required],
    designation: ['', Validators.required],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    date_of_joining: ['', Validators.required],
    department: ['', Validators.required],
    employee_photo: ['']
  });

  employeeId = '';
  isEditMode = false;
  submitted = false;
  uploading = false;
  saving = false;
  uploadMessage = '';
  uploadError = '';
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEditMode = !!this.employeeId;

    if (!this.isEditMode) {
      return;
    }

    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (response) => {
        if (!response.success || !response.employee) {
          this.errorMessage = response.message;
          return;
        }

        this.form.patchValue({
          ...response.employee,
          date_of_joining: response.employee.date_of_joining.slice(0, 10),
          employee_photo: response.employee.employee_photo || ''
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Unable to load employee.';
      }
    });
  }

  controlInvalid(name: string) {
    return this.form.get(name)?.invalid;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.uploadMessage = '';
    this.uploadError = '';

    if (!file) {
      return;
    }

    this.uploading = true;
    this.uploadService.uploadPhoto(file).subscribe({
      next: (photoUrl) => {
        this.uploading = false;
        this.form.patchValue({ employee_photo: photoUrl });
        this.uploadMessage = 'Profile photo uploaded successfully.';
      },
      error: (error) => {
        this.uploading = false;
        this.uploadError = error.message || 'Photo upload failed.';
      }
    });
  }

  submit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.saving = true;
    const payload = {
      ...this.form.getRawValue(),
      salary: Number(this.form.getRawValue().salary),
      employee_photo: this.form.getRawValue().employee_photo || null
    };

    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.addEmployee(payload);

    request.subscribe({
      next: (response) => {
        this.saving = false;
        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        this.successMessage = this.isEditMode ? 'Employee updated successfully.' : 'Employee created successfully.';
        setTimeout(() => void this.router.navigate(['/employees']), 700);
      },
      error: (error) => {
        this.saving = false;
        this.errorMessage = error.message || 'Unable to save employee.';
      }
    });
  }
}
