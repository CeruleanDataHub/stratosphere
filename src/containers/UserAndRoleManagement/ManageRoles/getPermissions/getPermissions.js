import Axios from 'axios';
import env from '../../../../config';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;
const {AUTH0_RESOURCE_SERVER_ID} = envVar;

const getAllPermissions = async token =>
  await Axios.get(
    `${AUTH0_PROXY_URL}/resource-servers/${AUTH0_RESOURCE_SERVER_ID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export default getAllPermissions;
