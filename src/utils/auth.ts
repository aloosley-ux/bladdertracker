const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const saltBytes = new Uint8Array(base64ToBytes(salt));
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 120000,
      hash: 'SHA-256',
    },
    key,
    256
  );

  return bytesToBase64(new Uint8Array(bits));
}

export async function createPasswordCredentials(password: string): Promise<{ passwordHash: string; passwordSalt: string }> {
  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);
  return { passwordHash, passwordSalt };
}

export async function verifyPassword(password: string, passwordHash: string, passwordSalt: string): Promise<boolean> {
  const candidateHash = await hashPassword(password, passwordSalt);
  return candidateHash === passwordHash;
}
