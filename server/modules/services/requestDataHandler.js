/**
 * @module requestData
 * @function
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @param {Object} params
 * @var {Object} requestData
 * @var {Boolean} isData
 * @var {Boolean} isParams
 * @var {Boolean} isAccessToken
 * @return {Object}
 */
module.exports = (method, url, auth, data, params, headers) => {
  const isData = data !== '' && data !== undefined;
  const isParams = params !== '' && params !== undefined;
  const isAuth = auth !== '' && auth !== undefined;

  let requestData = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (isData) {
    requestData.data = data;
  }
  if (isAuth) {
    requestData.auth = auth;
  }

  if (isParams) {
    requestData.params = params;
  }
  return requestData;
};
