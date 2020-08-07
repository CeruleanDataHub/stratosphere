const getUsersOutputMapper = data => {
  return data.map(item => ({
    ...item,
    roles: [],
  }));
};

export default getUsersOutputMapper;
