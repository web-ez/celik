export const toBase64 = (buf: Buffer) =>
  btoa(Array.prototype.map.call(buf, (ch) => String.fromCharCode(ch)).join(""));

export const toBase64Src = (buf: Buffer) =>
  `data:image/png;base64, ${toBase64(buf)}`;
