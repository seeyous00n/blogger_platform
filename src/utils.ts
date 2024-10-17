export const setAndThrowError = ({ message, status }: any) => {
  const err = { message, status };
  throw new Error(JSON.stringify(err));
};