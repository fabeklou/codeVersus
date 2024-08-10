import bcrypt from 'bcrypt';

const hashPassword = async (plaintextPassword) => {
  const saltRounds = 10;

  return bcrypt.hash(plaintextPassword, saltRounds).then((hash) => {
    return hash;
  }).catch((error) => {
    throw new Error(error);
  });
};

export default hashPassword;
