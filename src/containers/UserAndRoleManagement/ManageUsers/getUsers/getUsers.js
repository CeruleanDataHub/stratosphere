import env from '../../../../config';
import Axios from 'axios';
import getUsersOutputMapper from './getUsersOutputMapper/getUsersOutputMapper';

const envVar = env();
const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const getAllUsers = async token => {
  const response = await Axios.get(`${AUTH0_PROXY_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const mappedResponse = getUsersOutputMapper(response.data);

  try {
    return mappedResponse;
  } catch (error) {
    console.error(error);
  }
};

export default getAllUsers;
