const resolvers = {
  Query: {
    login: () => ({ status: true, message: "stub", token: null, user: null }),
    getAllEmployees: () => [],
    searchEmployeeByEid: () => null,
    searchEmployeesByDesignationOrDepartment: () => []
  },
  Mutation: {
    signup: () => ({ status: true, message: "stub", token: null, user: null }),
    addEmployee: () => null,
    updateEmployeeByEid: () => null,
    deleteEmployeeByEid: () => ({ status: true, message: "stub", error: null, data: null })
  }
};

export default resolvers;
