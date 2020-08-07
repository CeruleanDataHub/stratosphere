const getUsersOutputMapper = data => {
  return data.map(({name, email, logins_count, last_login}, idx) => ({
    id: idx,
    name,
    email: email || '',
    logins: logins_count,
    lastLogin: last_login,
    roles: [],
  }));
};

export default getUsersOutputMapper;
