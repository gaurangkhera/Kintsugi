/**
 * End-to-End Encryption Utilities
 * Uses AES-GCM for authenticated encryption
 * Messages are encrypted client-side before reaching the database
 */

const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Derives a cryptographic key from a passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: BufferSource): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Gets or creates the encryption key for the current channel
 * In production, this should be derived from user credentials or shared securely
 */
async function getChannelKey(channelName: string): Promise<CryptoKey> {
  // For THE WORKSHOP, we use a deterministic key derivation
  // In production, consider using a key exchange protocol like Diffie-Hellman
  const salt = new TextEncoder().encode(`kintsugi-workshop-${channelName}`);
  
  // This passphrase should ideally come from user authentication
  // For now, we use a channel-specific secret
  const passphrase = `workshop-secure-comms-${channelName}-v1`;
  
  return deriveKey(passphrase, salt);
}

/**
 * Encrypts a message using AES-GCM
 * Returns base64-encoded ciphertext with IV prepended
 */
export async function encryptMessage(plaintext: string, channelName: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // Generate random IV for this message
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Get encryption key for this channel
    const key = await getChannelKey(channelName);
    
    // Encrypt the message
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      data
    );
    
    // Combine IV + ciphertext for storage
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt message');
  }
}

/**
 * Decrypts a message using AES-GCM
 * Expects base64-encoded ciphertext with IV prepended
 */
export async function decryptMessage(encryptedData: string, channelName: string): Promise<string> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);
    
    // Get decryption key for this channel
    const key = await getChannelKey(channelName);
    
    // Decrypt the message
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv,
      },
      key,
      ciphertext
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Return indicator that decryption failed instead of throwing
    return '[ENCRYPTED - Unable to decrypt]';
  }
}

/**
 * Generates a secure random channel ID
 */
export function generateSecureChannelId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a string using SHA-256
 * Useful for creating deterministic but secure identifiers
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
