let allEnv;

const env = () => {
  if (allEnv) {
    return allEnv;
  } else {
    if (process.env.NODE_ENV === 'development') {
      try {
        const env_var = require('../env.js');
        if (env_var) {
          allEnv = combineEnv(env_var);
        }
      } catch (err) {
        console.log(
          'env.js file missing. Please follow the instruction in the README',
        );
      }
    } else {
      allEnv = combineEnv();
    }
  }
  return allEnv;
};

const combineEnv = (dotEnv = {}) => {
  const processEnv = typeof process !== 'undefined' ? process.env : {};
  const injectedEnv = window && window.injectedEnv ? window.injectedEnv : {};
  const env = {
    ...dotEnv,
    ...processEnv,
    ...injectedEnv,
  };
  return env;
};

export default env;
