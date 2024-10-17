export const setAndThrowError = ({ message, status }: { message: string, status: number }) => {
  const err = { message, status };
  throw new Error(JSON.stringify(err));
};