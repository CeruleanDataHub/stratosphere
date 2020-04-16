const getEnv = async () => {
  if (process.env.NODE_ENV === 'development') {
    let dotEnv;

    try {
      const env_var = await import('../.env.js');
      if (env_var && env_var.default) {
        dotEnv = {...env_var.default};
      }
      return createEnv(dotEnv);
    } catch (err) {
      console.log(
        '.env.js file missing. Please follow the instruction in the README',
      );
    }
  } else {
    return createEnv({});
  }
};

const createEnv = dotEnv => {
  const processEnv = typeof process !== 'undefined' ? process.env : {};
  const injectedEnv = window && window.injectedEnv ? window.injectedEnv : {};
  const env = {
    ...dotEnv,
    ...processEnv,
    ...injectedEnv,
  };
  console.log('ENV ', env);
  return env;
};
export default getEnv;
