import env from '../../../../config';
import Axios from 'axios';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const getAllRoles = async token => {
  const response = await Axios.get(`${AUTH0_PROXY_URL}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getAllRoles;
