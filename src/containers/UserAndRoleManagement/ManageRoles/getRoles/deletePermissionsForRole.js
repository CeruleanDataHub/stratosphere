import Axios from 'axios';
import env from '../../../../config';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const deletePermissionInRole = async (token, id, body) =>
  await Axios.delete(`${AUTH0_PROXY_URL}/roles/${id}/permissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: body,
  });

export default deletePermissionInRole;
