/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/prefer-default-export */
import qs from 'querystring';

export function sleep(t) {
  return new Promise(resolve => setTimeout(resolve, process.env.NODE_ENV === 'production' ? t / 5 : t));
}

export function formatTimestamp(ts) {
  if (!ts) {
    return '-';
  }

  const date = new Date();
  date.setTime(ts);

  return date.toLocaleString();
}

export const formatError = error => {
  if (Array.isArray(error.errors)) {
    return error.errors.map(x => x.message).join('\n');
  }

  return error.message;
};

export const formatLocale = (locale = 'en') => {
  if (locale === 'zh') {
    return 'zh_CN';
  }

  return locale;
};

export const parseQuery = str =>
  str
    .replace(/^\?/, '')
    .split('&')
    .map(x => x.split('='))
    .filter(([key]) => !!key)
    .reduce((memo, x) => {
      const key = x[0];
      const value = decodeURIComponent(x[1]) || true;
      memo[key] = value;
      return memo;
    }, {});

// Append any query string url to api requests, to make passport work
export const appendParams = (url, extraParams = {}) => {
  const [pathname, query = ''] = url.split('?');
  const oldParams = parseQuery(query);

  const params = Object.assign({}, oldParams, extraParams);
  return `${pathname}?${qs.stringify(params)}`;
};
