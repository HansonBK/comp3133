import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeNamePipe } from '../../pipes/employee-name.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeNamePipe],
  template: `
    <section class="detail-page">
      <div class="detail-card" *ngIf="employee; else loadingState">
        <div class="detail-topbar">
          <div>
            <p class="eyebrow">Employee details</p>
            <h1>{{ employee | employeeName }}</h1>
            <p class="subhead">{{ employee.designation }} in {{ employee.department }}</p>
          </div>
          <div class="actions">
            <a routerLink="/employees" class="btn btn--secondary">Back to List</a>
            <a [routerLink]="['/employees', employee._id, 'edit']" class="btn btn--primary">Update</a>
          </div>
        </div>

        <div class="profile-grid">
          <div class="profile-media">
            <img *ngIf="employee.employee_photo" [src]="employee.employee_photo" [alt]="employee | employeeName" />
            <div class="avatar" *ngIf="!employee.employee_photo">{{ employee.first_name.charAt(0) }}</div>
          </div>

          <div class="info-grid">
            <article>
              <span>Email</span>
              <strong>{{ employee.email }}</strong>
            </article>
            <article>
              <span>Gender</span>
              <strong>{{ employee.gender }}</strong>
            </article>
            <article>
              <span>Position</span>
              <strong>{{ employee.designation }}</strong>
            </article>
            <article>
              <span>Department</span>
              <strong>{{ employee.department }}</strong>
            </article>
            <article>
              <span>Salary</span>
              <strong>{{ employee.salary | currency:'CAD':'symbol':'1.0-0' }}</strong>
            </article>
            <article>
              <span>Date of Joining</span>
              <strong>{{ employee.date_of_joining | date:'fullDate' }}</strong>
            </article>
          </div>
        </div>
      </div>

      <ng-template #loadingState>
        <div class="detail-card detail-card--centered">
          <p *ngIf="!errorMessage">Loading employee details...</p>
          <p class="feedback feedback--error" *ngIf="errorMessage">{{ errorMessage }}</p>
          <a routerLink="/employees" class="btn btn--secondary">Back to List</a>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    .detail-page {
      padding: 24px;
    }

    .detail-card {
      background: rgba(255, 253, 248, 0.92);
      border: 1px solid var(--line);
      border-radius: 26px;
      box-shadow: var(--shadow);
      padding: 28px;
      display: grid;
      gap: 28px;
    }

    .detail-card--centered {
      justify-items: start;
    }

    .detail-topbar {
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
    p {
      margin: 0;
    }

    h1 {
      font-size: clamp(32px, 5vw, 52px);
      margin-bottom: 10px;
    }

    .subhead {
      color: var(--muted);
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      align-items: start;
    }

    .profile-media {
      display: grid;
      place-items: center;
    }

    img,
    .avatar {
      width: 220px;
      height: 220px;
      border-radius: 30px;
      object-fit: cover;
      border: 1px solid var(--line);
      background: var(--accent-soft);
    }

    .avatar {
      display: grid;
      place-items: center;
      font-size: 54px;
      font-weight: 700;
      color: var(--accent-strong);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    article {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 18px;
      display: grid;
      gap: 6px;
    }

    span {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
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

    .feedback--error {
      color: var(--danger);
    }

    @media (max-width: 900px) {
      .detail-page {
        padding: 16px;
      }

      .detail-topbar,
      .profile-grid {
        grid-template-columns: 1fr;
        flex-direction: column;
        align-items: flex-start;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);

  employee: Employee | null = null;
  errorMessage = '';

  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) {
      this.errorMessage = 'Employee ID is missing.';
      return;
    }

    this.employeeService.getEmployee(employeeId).subscribe({
      next: (response) => {
        if (!response.success || !response.employee) {
          this.errorMessage = response.message;
          return;
        }

        this.employee = response.employee;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Unable to load employee details.';
      }
    });
  }
}
