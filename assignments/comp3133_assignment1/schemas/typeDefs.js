const { gql } = require("graphql-tag");

module.exports = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  type AuthPayload {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type EmployeePayload {
    success: Boolean!
    message: String!
    employee: Employee
  }

  type EmployeesPayload {
    success: Boolean!
    message: String!
    employees: [Employee!]!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    # user can login using username OR email + password
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input EmployeeUpdateInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: EmployeesPayload!
    getEmployeeByEid(eid: ID!): EmployeePayload!
    searchEmployees(designation: String, department: String): EmployeesPayload!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    addEmployee(input: EmployeeInput!): EmployeePayload!
    updateEmployeeByEid(eid: ID!, input: EmployeeUpdateInput!): EmployeePayload!
    deleteEmployeeByEid(eid: ID!): EmployeePayload!
  }
`;