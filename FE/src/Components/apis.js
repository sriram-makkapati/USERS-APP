
const url = 'http://127.0.0.1:5000/'
// const url = ''
const apis = {
    "distinctDatasets_api": `${url}distinctDatasets`,
    "api/role_api": `${url}api/role`,
    "user_roles_api": `${url}user_roles`,
    "add_user_api": `${url}add_user`,
    "api/roles_api": `${url}api/roles`,
    "api/roles/${roleId}_api": `${url}api/roles/${roleId}`,
    "api/users/${username}/roles_api": `${url}api/users/${username}/roles`,
    "api/users_api": `${url}api/users`,
    "update_role/${USER_NAME}_api": `${url}update_role/${USER_NAME}`,
    "delete_user/${username}_api": `${url}delete_user/${username}`,
}

export default apis


