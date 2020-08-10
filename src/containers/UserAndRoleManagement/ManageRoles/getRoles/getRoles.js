import env from '../../../../config';
import Axios from 'axios';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const getAllRolesWithPermissions = async token => {
  const roles = await getAllRoles(token);
  const permissions = await getPermissionsFor(roles)(token);
  const rolesWithPermissions = injectRolesWithPermissions(roles, permissions);

  try {
    return rolesWithPermissions;
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

const injectRolesWithPermissions = async (roles, permissions) => {
  const resolvedPermissions = await Promise.all(permissions);

  return resolvedPermissions.map(({data}, index) => ({
    ...roles.data[index],
    permissions: data,
  }));
};

export default getAllRolesWithPermissions;
