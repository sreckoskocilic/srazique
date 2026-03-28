// Decrypt obfuscated questions at runtime
function decryptQuestions(encryptedBase64) {
  const key = Buffer.from('SraziqueQuestions2024', 'utf8');

  // Decode base64
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  // XOR decrypt using Buffer operations
  const decrypted = Buffer.alloc(encrypted.length);
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ key[i % key.length];
  }

  return decrypted.toString('utf8');
}

module.exports = { decryptQuestions };
