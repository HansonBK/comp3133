

const typeDefs=`

    type User{
        _id: ID!
        username: String!
        email: String!
        password: String!
        created_at: String
        updated_at: String
    }
    type Employee{
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
        created_at: String
        updated_at: String
    }

    type Query {
        login(usernameOrEmail: String!, password: String!): AuthPayload!
        getAllEmployees : [Employee!]!
        searchEmployeeByEid(eid:ID!):Employee
        searchEmployeesByDesignationOrDepartment(designation: String, department: String): [Employee!]!

    }


    type Mutation {
  signup(username: String!, email: String!, password: String!): AuthPayload!

  addEmployee(
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  ): Employee!

  updateEmployeeByEid(
    eid: ID!
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  ): Employee

  deleteEmployeeByEid(eid: ID!): ApiResponse!
}


    type ApiResponse { 
        status: Boolean!, 
        message: String!, 
        error: String, 
        data: String 
    }

    type AuthPayload { 
        status: Boolean!, 
        message: String!, 
        error: String, 
        token: String, 
        user: User 
    }

`;

export default typeDefs;
