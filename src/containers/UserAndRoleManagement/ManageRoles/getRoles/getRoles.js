import env from '../../../../config';
import Axios from 'axios';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const getAllRolesWithPermissionsAndUsers = async token => {
  const roles = await getAllRoles(token);
  const permissions = await getPermissionsFor(roles)(token);
  const users = await getUsersFor(roles)(token);

  const rolesWithPermissionsAndUsers = injectRolesWithPermissionsAndUsers(
    roles,
    permissions,
    users,
  );

  try {
    return rolesWithPermissionsAndUsers;
  } catch (error) {
    console.error(error);
  }
};

const getAllRoles = async token =>
  await Axios.get(`${AUTH0_PROXY_URL}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const getPermissionsFor = response => token =>
  response.data.map(
    async ({id}) =>
      await Axios.get(`${AUTH0_PROXY_URL}/roles/${id}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  );

const getUsersFor = response => token =>
  response.data.map(
    async ({id}) =>
      await Axios.get(`${AUTH0_PROXY_URL}/roles/${id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  );

const injectRolesWithPermissionsAndUsers = async (
  roles,
  permissions,
  users,
) => {
  const resolvedPermissions = await Promise.all(permissions);
  const resolvedUsers = await Promise.all(users);

  const rolesWithPermissions = injectRolesWithPermissions(
    roles,
    resolvedPermissions,
  );

  return injectRolesAndPermissionsWithUsers(
    resolvedUsers,
    rolesWithPermissions,
  );
};

const injectRolesAndPermissionsWithUsers = (users, rolesWithPermissions) =>
  users.map(({data}, index) => ({
    ...rolesWithPermissions[index],
    users: data,
  }));

const injectRolesWithPermissions = (roles, resolvedPermissions) =>
  resolvedPermissions.map(({data}, index) => ({
    ...roles.data[index],
    permissions: data,
  }));

export default getAllRolesWithPermissionsAndUsers;
