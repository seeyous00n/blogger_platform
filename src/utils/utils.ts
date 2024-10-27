import bcrypt from 'bcrypt';

export const generatePassword = async (password: string, soldFromDB?: string) => {
  const salt = soldFromDB ?? await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};