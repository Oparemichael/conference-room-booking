const crypto = require("crypto");

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

const getSecret = () => process.env.AUTH_SECRET || "dev-change-this-auth-secret";

const base64UrlEncode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const base64UrlDecode = (value) =>
  JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

const sign = (value) =>
  crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");

const createToken = (payload) => {
  const tokenPayload = {
    ...payload,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = base64UrlEncode(tokenPayload);
  return `${body}.${sign(body)}`;
};

const verifyToken = (token) => {
  try {
    if (!token || !token.includes(".")) return null;

    const [body, signature] = token.split(".");
    const expectedSignature = sign(body);

    if (Buffer.byteLength(signature) !== Buffer.byteLength(expectedSignature)) {
      return null;
    }

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValidSignature) return null;

    const payload = base64UrlDecode(body);

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
