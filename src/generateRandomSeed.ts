import { seedWords } from './seedWords.js';

export function generateRandomSeed(wordsCount = 15) {
  return Array.from(
    crypto.getRandomValues(new Uint32Array(wordsCount)),
    x => seedWords[x % seedWords.length]
  ).join(' ');
}
