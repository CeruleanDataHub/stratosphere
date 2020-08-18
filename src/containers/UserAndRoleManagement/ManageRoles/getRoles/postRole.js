import env from '../../../../config';
import Axios from 'axios';

const postRole = async (token, body) => {
  const AUTH0_PROXY_URL = `${env().BASE_API_URL}/auth0`;

  try {
    return await Axios.post(`${AUTH0_PROXY_URL}/roles`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error.response;
  }
};

export default postRole;
