export const cookieOptionsForRefreshToken = () => {
  return {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24
  };
};