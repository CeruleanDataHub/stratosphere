import Axios from 'axios';
import env from '../../../../config';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const updatePermissionsInRole = async (token, id, body) =>
  await Axios.post(`${AUTH0_PROXY_URL}/roles/${id}/permissions`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default updatePermissionsInRole;
