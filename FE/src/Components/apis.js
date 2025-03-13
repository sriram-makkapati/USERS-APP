const BASE_URL = 'http://127.0.0.1:5000/';

const apis = {
  distinctDatasets: `${BASE_URL}distinctDatasets`,
  role: `${BASE_URL}api/role`,
  userRoles: `${BASE_URL}user_roles`,
  addUser: `${BASE_URL}add_user`,
  roles: `${BASE_URL}api/roles`,
  roleId: `${BASE_URL}api/roles`,
  userRolesByUsername: (username) => `${BASE_URL}api/users/${username}/roles`,
  users: `${BASE_URL}api/users`,
  updateRole: (userName) => `${BASE_URL}update_role/${userName}`,
  deleteUser: (username) => `${BASE_URL}delete_user/${username}`,
};

export default apis;
