import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

const EMPLOYEE_FIELDS = gql`
  fragment EmployeeFields on Employee {
    _id
    first_name
    last_name
    email
    gender
    designation
    salary
    date_of_joining
    department
    employee_photo
    created_at
    updated_at
  }
`;

const GET_EMPLOYEES_QUERY = gql`
  query GetAllEmployees {
    getAllEmployees {
      success
      message
      employees {
        ...EmployeeFields
      }
    }
  }
  ${EMPLOYEE_FIELDS}
`;

const GET_EMPLOYEE_QUERY = gql`
  query GetEmployee($eid: ID!) {
    getEmployeeByEid(eid: $eid) {
      success
      message
      employee {
        ...EmployeeFields
      }
    }
  }
  ${EMPLOYEE_FIELDS}
`;

const SEARCH_EMPLOYEES_QUERY = gql`
  query SearchEmployees($designation: String, $department: String) {
    searchEmployees(designation: $designation, department: $department) {
      success
      message
      employees {
        ...EmployeeFields
      }
    }
  }
  ${EMPLOYEE_FIELDS}
`;

const ADD_EMPLOYEE_MUTATION = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      success
      message
      employee {
        ...EmployeeFields
      }
    }
  }
  ${EMPLOYEE_FIELDS}
`;

const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee($eid: ID!, $input: EmployeeUpdateInput!) {
    updateEmployeeByEid(eid: $eid, input: $input) {
      success
      message
      employee {
        ...EmployeeFields
      }
    }
  }
  ${EMPLOYEE_FIELDS}
`;

const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($eid: ID!) {
    deleteEmployeeByEid(eid: $eid) {
      success
      message
      employee {
        _id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apollo = inject(Apollo);

  getEmployees() {
    return this.apollo.query<{ getAllEmployees: { success: boolean; message: string; employees: Employee[] } }>({
      query: GET_EMPLOYEES_QUERY,
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.getAllEmployees ?? { success: false, message: 'Unable to load employees.', employees: [] }));
  }

  getEmployee(eid: string) {
    return this.apollo.query<{ getEmployeeByEid: { success: boolean; message: string; employee: Employee | null } }>({
      query: GET_EMPLOYEE_QUERY,
      variables: { eid },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.getEmployeeByEid ?? { success: false, message: 'Unable to load employee.', employee: null }));
  }

  searchEmployees(filters: { designation?: string; department?: string }) {
    return this.apollo.query<{ searchEmployees: { success: boolean; message: string; employees: Employee[] } }>({
      query: SEARCH_EMPLOYEES_QUERY,
      variables: {
        designation: filters.designation || null,
        department: filters.department || null
      },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.searchEmployees ?? { success: false, message: 'Search failed.', employees: [] }));
  }

  addEmployee(input: Partial<Employee>) {
    return this.apollo.mutate<{ addEmployee: { success: boolean; message: string; employee: Employee | null } }>({
      mutation: ADD_EMPLOYEE_MUTATION,
      variables: { input },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.addEmployee ?? { success: false, message: 'Employee creation failed.', employee: null }));
  }

  updateEmployee(eid: string, input: Partial<Employee>) {
    return this.apollo.mutate<{ updateEmployeeByEid: { success: boolean; message: string; employee: Employee | null } }>({
      mutation: UPDATE_EMPLOYEE_MUTATION,
      variables: { eid, input },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.updateEmployeeByEid ?? { success: false, message: 'Employee update failed.', employee: null }));
  }

  deleteEmployee(eid: string) {
    return this.apollo.mutate<{ deleteEmployeeByEid: { success: boolean; message: string; employee: { _id: string } | null } }>({
      mutation: DELETE_EMPLOYEE_MUTATION,
      variables: { eid },
      fetchPolicy: 'no-cache'
    }).pipe(map((result) => result.data?.deleteEmployeeByEid ?? { success: false, message: 'Employee deletion failed.', employee: null }));
  }
}
