import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: string): void => {
  return cookies.set(name, value, {
    path: '/',
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    domain: '.gomgomdiary.site',
  });
};

export const getCookie = (name: string): string | undefined => {
  return cookies.get(name, { doNotParse: true }) as string | undefined;
};

export const removeCookie = (name: string): void => {
  return cookies.remove(name, { path: '/', domain: '.gomgomdiary.site' });
};
