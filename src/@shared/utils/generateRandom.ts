import { v4 as uuidv4 } from 'uuid';

function generateRandomNumber(length = 16): number {
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max + 1));
}

function generateRandomText(length = 16) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-';

  let generatedId = '';

  for (let i = 0; i <= length; i += 1) {
    const randomCharacterIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomCharacterIndex];
    generatedId += randomCharacter;
  }

  return generatedId.trim();
}

function generateMixed(length = 30): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%ˆ&*()<>?[]{}';
  let generatedId = '';

  for (let i = 0; i < length; i++) {
    const randomCharacterIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomCharacterIndex];
    generatedId += randomCharacter;
  }

  return generatedId;
}

function generateUUID(): string {
  const uuid = uuidv4();

  return uuid;
}

export const GenerateRandom = {
  number: generateRandomNumber,
  text: generateRandomText,
  mixed: generateMixed,
  id: generateUUID,
};
