import { md5 } from '../pkg/waves_crypto';
import { base16Encode } from './base16';
import { initWasm } from './initWasm';
import { sha256 } from './sha256';
import { bytesToString, stringToBytes } from './utf-8';

export async function deriveSeedEncryptionKey(
  password: Uint8Array,
  hashRounds: number,
  salt: Uint8Array
) {
  let hashedPassword = password;

  while (hashRounds--) {
    hashedPassword = stringToBytes(
      base16Encode(new Uint8Array(await sha256(hashedPassword)))
    );
  }

  const hashedPasswordBytes = Uint8Array.from(
    bytesToString(hashedPassword)
      .split('')
      .map(c => c.charCodeAt(0))
  );

  initWasm();

  const part1 = md5(Uint8Array.of(...hashedPasswordBytes, ...salt));
  const part2 = md5(Uint8Array.of(...part1, ...hashedPasswordBytes, ...salt));

  const key = Uint8Array.of(...part1, ...part2);
  const iv = md5(Uint8Array.of(...part2, ...hashedPasswordBytes, ...salt));

  return [key, iv];
}
