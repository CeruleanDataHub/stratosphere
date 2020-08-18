const getUsersOutputMapper = data => {
  return data.map(
    ({user_id, name, email, logins_count, last_login, blocked}, idx) => ({
      id: idx,
      userId: user_id,
      name,
      email: email || '',
      logins: logins_count,
      lastLogin: last_login,
      blocked: blocked || false,
      roles: [],
    }),
  );
};

export default getUsersOutputMapper;
