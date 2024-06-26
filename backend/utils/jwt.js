import jwt from 'jsonwebtoken';
import config from 'config';

// signJwt creates a new JWT for a user after they log in or register
/*
    - retrieve private key from the configuration, decode it from base64 to ASCII
    - signs the JWT with the given payload, private key, and options using the RS256 algorithm
        - `payload`:    data to be included in the JWT
        - `key`:        configuration key to retrieve the private key
        - `options`:    optional settings for signing the JWT
    - returns the signed JWT
*/
export const signJwt = (payload, key, options = {}) => {
  const privateKey = Buffer.from(config.get(key), 'base64').toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

// verifyJwt validates a JWT presented by a user, ensuring it is authentic and unaltered
/* 
    - retrieves public key from the configuration, decodes it from base64 to ASCII
    - tries to verify the JWT with the public key (logs any error if encountered)
        - `token`:      the JWT to verify
        - `key`:        configuration key to retrieve the public key
    - returns the decoded token if verification succeeds, otherwise "null"
*/
export const verifyJwt = (token, key) => {
  try {
    const publicKey = Buffer.from(config.get(key), 'base64').toString('ascii');
    return jwt.verify(token, publicKey);
  } catch (error) {
    console.log(error);
    return null;
  }
};
