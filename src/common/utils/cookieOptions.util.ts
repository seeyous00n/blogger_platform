class CookieOptions {
  getOptionsForRefreshToken() {
    return {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24
    };
  }
}

export const cookieOptions = new CookieOptions();