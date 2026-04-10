import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { EmployeeNamePipe } from '../../pipes/employee-name.pipe';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, EmployeeNamePipe],
  template: `
    <section class="dashboard">
      <header class="hero">
        <div>
          <p class="eyebrow">Employee management</p>
          <h1>Employees Directory</h1>
          <p class="subhead">Browse, search, add, update, and remove employee records from your GraphQL-powered dashboard.</p>
        </div>
        <div class="hero-actions">
          <a routerLink="/employees/new" class="btn btn--primary">Add Employee</a>
          <button type="button" class="btn btn--ghost" (click)="logout()">Logout</button>
        </div>
      </header>

      <section class="panel">
        <form [formGroup]="searchForm" (ngSubmit)="search()" class="search-grid">
          <label>
            Department
            <input type="text" formControlName="department" placeholder="Search by department" />
          </label>
          <label>
            Position
            <input type="text" formControlName="designation" placeholder="Search by position/designation" />
          </label>
          <div class="search-actions">
            <button type="submit" class="btn btn--primary" [disabled]="loading">{{ loading ? 'Searching...' : 'Search' }}</button>
            <button type="button" class="btn btn--secondary" (click)="reset()">Reset</button>
          </div>
        </form>

        <p class="feedback feedback--error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="feedback feedback--success" *ngIf="successMessage">{{ successMessage }}</p>
      </section>

      <section class="panel table-panel">
        <div class="table-meta">
          <h2>Employee List</h2>
          <span>{{ employees.length }} record{{ employees.length === 1 ? '' : 's' }}</span>
        </div>

        <div class="table-wrap" *ngIf="employees.length; else emptyState">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employees">
                <td>
                  <div class="employee-cell">
                    <img *ngIf="employee.employee_photo" [src]="employee.employee_photo" [alt]="employee | employeeName" />
                    <div class="avatar avatar--fallback" *ngIf="!employee.employee_photo">{{ employee.first_name.charAt(0) }}</div>
                    <div>
                      <strong>{{ employee | employeeName }}</strong>
                      <p>{{ employee.gender || 'Other' }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.designation }}</td>
                <td>{{ employee.department }}</td>
                <td>{{ employee.salary | currency:'CAD':'symbol':'1.0-0' }}</td>
                <td>{{ employee.date_of_joining | date:'mediumDate' }}</td>
                <td>
                  <div class="row-actions">
                    <a [routerLink]="['/employees', employee._id]" class="btn btn--chip">View</a>
                    <a [routerLink]="['/employees', employee._id, 'edit']" class="btn btn--chip">Update</a>
                    <button type="button" class="btn btn--danger" (click)="remove(employee)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <h3>No employees found</h3>
            <p>Try a different search or add your first employee record.</p>
            <a routerLink="/employees/new" class="btn btn--primary">Create Employee</a>
          </div>
        </ng-template>
      </section>
    </section>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      display: grid;
      gap: 20px;
    }

    .hero,
    .panel {
      background: rgba(255, 253, 248, 0.92);
      border: 1px solid var(--line);
      border-radius: 26px;
      box-shadow: var(--shadow);
    }

    .hero {
      padding: 28px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-end;
      background:
        linear-gradient(135deg, rgba(15, 118, 110, 0.92), rgba(8, 47, 73, 0.88)),
        linear-gradient(180deg, #0f766e, #083344);
      color: #f8fafc;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 12px;
      opacity: 0.8;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1 {
      font-size: clamp(34px, 5vw, 54px);
      margin-bottom: 10px;
    }

    .subhead {
      max-width: 680px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.86);
    }

    .hero-actions,
    .search-actions,
    .row-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .panel {
      padding: 24px;
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      align-items: end;
    }

    label {
      display: grid;
      gap: 8px;
      font-weight: 600;
    }

    input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 13px 14px;
      background: #fff;
    }

    .table-meta {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1080px;
    }

    th,
    td {
      text-align: left;
      padding: 16px 12px;
      border-bottom: 1px solid var(--line);
      vertical-align: middle;
    }

    th {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }

    .employee-cell {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .employee-cell p {
      color: var(--muted);
      margin-top: 4px;
    }

    img,
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      background: var(--accent-soft);
    }

    .avatar {
      display: grid;
      place-items: center;
      font-weight: 700;
      color: var(--accent-strong);
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

    .btn--secondary,
    .btn--ghost,
    .btn--chip {
      background: #fff;
      color: var(--ink);
      border: 1px solid var(--line);
    }

    .btn--ghost {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.22);
    }

    .btn--danger {
      background: var(--danger-soft);
      color: var(--danger);
      border: 1px solid rgba(190, 18, 60, 0.12);
    }

    .feedback {
      margin-top: 14px;
      font-size: 14px;
    }

    .feedback--error {
      color: var(--danger);
    }

    .feedback--success {
      color: var(--accent-strong);
    }

    .empty-state {
      padding: 40px 12px 20px;
      text-align: center;
      display: grid;
      gap: 12px;
      justify-items: center;
    }

    .empty-state p {
      color: var(--muted);
    }

    @media (max-width: 1024px) {
      .search-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .dashboard {
        padding: 16px;
      }

      .hero {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly searchForm = this.fb.nonNullable.group({
    department: [''],
    designation: ['']
  });

  employees: Employee[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        this.employees = response.employees;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to load employees.';
      }
    });
  }

  search() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const filters = this.searchForm.getRawValue();

    this.employeeService.searchEmployees(filters).subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        this.employees = response.employees;
        this.successMessage = `Search completed. ${response.employees.length} employee record${response.employees.length === 1 ? '' : 's'} found.`;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Search failed.';
      }
    });
  }

  reset() {
    this.searchForm.reset({
      department: '',
      designation: ''
    });
    this.successMessage = '';
    this.loadEmployees();
  }

  remove(employee: Employee) {
    const confirmed = window.confirm(`Delete ${employee.first_name} ${employee.last_name}?`);
    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(employee._id).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        this.successMessage = 'Employee deleted successfully.';
        this.employees = this.employees.filter((item) => item._id !== employee._id);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Delete failed.';
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearSession();
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.authService.clearSession();
        void this.router.navigate(['/login']);
      }
    });
  }
}
