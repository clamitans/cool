const {
  flux: { intercept },
} = shelter;
const CHARSET = 'qwertyuiopasdfghjklzxcvbnm1234567890';
const CHARSET_LEN = CHARSET.length;
function createRandomBullshit(length) {
  if (!length || length <= 0) return '';
  const out = new Array(length);
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < length; i++) {
    const b = bytes[i];
    let ch = CHARSET.charAt(b % CHARSET_LEN);
    out[i] = (b & 1) ? ch.toUpperCase() : ch;
  }
  return out.join('');
}
const unintercept = intercept((dispatch) => {
  if (dispatch?.type !== 'UPLOAD_ATTACHMENT_ADD_FILES') return dispatch;
  const files = dispatch?.files;
  if (!files || !files.length) return dispatch;
  for (let i = 0; i < files.length; i++) {
    const file = files[i]?.file;
    if (!file || !file.name) continue;
    let newFilename = createRandomBullshit(10);
    const name = file.name;
    const dotIndex = name.lastIndexOf('.');
    if (dotIndex !== -1) {
      newFilename += name.slice(dotIndex);
    }
    Object.defineProperty(file, 'name', { value: newFilename });
  }
  return dispatch;
});
export function onUnload() {
  unintercept();
}