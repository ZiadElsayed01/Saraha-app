import cryptoJs from "crypto-js";

export const Encryption = async ({ value, key }) => {
  return cryptoJs.AES.encrypt(JSON.stringify(value), key).toString();
};

export const decryption = async ({ cipher, key }) => {
  return cryptoJs.AES.decrypt(cipher, key).toString(cryptoJs.enc.Utf8);
};
