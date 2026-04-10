import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

@Pipe({
  name: 'employeeName',
  standalone: true
})
export class EmployeeNamePipe implements PipeTransform {
  transform(employee: Pick<Employee, 'first_name' | 'last_name'> | null | undefined): string {
    if (!employee) {
      return '';
    }

    return `${employee.first_name} ${employee.last_name}`.trim();
  }
}
