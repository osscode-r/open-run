import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const AUTH_TOKEN = 'token';

export const setAuthCookie = (token: string, name: string) => {
  try {
    const toBase64 = Buffer.from(token).toString('base64');
    setCookie(name, toBase64, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAuthCookie = (name: string) => {
  const cookie = getCookie(name);
  if (!cookie) return undefined;
  return Buffer.from(cookie, 'base64').toString('ascii');
};

export const removeCookies = (cookies: string[]) => {
  cookies.forEach((cookie) => {
    deleteCookie(cookie);
  });
};

export const expireCookies = (cookies: string[]) => {
  cookies.forEach((cookie) => {
    setCookie(cookie, '', {
      maxAge: 0,
      path: '/',
    });
  });
};

export const getValidAuthTokens = (t?: string, rT?: string) => {
  const token = t || getAuthCookie(AUTH_TOKEN);
  const now = new Date();

  let tokenExpDate;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      tokenExpDate = new Date(decodedToken.exp * 1000);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return { token: undefined };
    }
  } else {
    return { token: undefined };
  }
  return {
    token: now < tokenExpDate ? token : undefined,
  };
};

export const isTokenExpired = (expiryDate?: string) => {
  if (!expiryDate) return true;

  const now = new Date();
  const expiry = new Date(expiryDate);

  return now.getTime() > expiry.getTime();
};