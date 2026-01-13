import crypto from "crypto";


const SECRET = process.env.COOKIE_SECRET;

export function sign(value) {
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("hex");

  return `${value}.${sig}`;
}

export function verify(signedValue) {
  if (!signedValue) return null;

  const [value, sig] = signedValue.split(".");
  if (!value || !sig) return null;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(value)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  )
    ? value
    : null;
}



