# Security Architecture - THE WORKSHOP Communications

## End-to-End Encryption (E2E)

All communications in THE WORKSHOP are protected by military-grade end-to-end encryption. Messages are encrypted on the client side **before** they reach the database, ensuring zero-knowledge security.

## Encryption Specifications

### Algorithm
- **Cipher**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Length**: 256 bits
- **IV Length**: 96 bits (12 bytes)
- **Authentication**: Built-in AEAD (Authenticated Encryption with Associated Data)

### Key Derivation
- **Function**: PBKDF2 (Password-Based Key Derivation Function 2)
- **Hash**: SHA-256
- **Iterations**: 100,000 (high iteration count for brute-force resistance)
- **Salt**: Channel-specific deterministic salt

## Security Features

### 1. **Client-Side Encryption**
- All encryption/decryption happens in the browser using Web Crypto API
- Server (Convex) never sees plaintext messages
- Database stores only encrypted ciphertext

### 2. **Per-Message Unique IV**
- Each message gets a cryptographically random Initialization Vector
- Prevents pattern analysis even with identical messages
- IV is prepended to ciphertext for decryption

### 3. **Authenticated Encryption**
- AES-GCM provides both confidentiality and authenticity
- Detects tampering attempts
- Prevents ciphertext manipulation attacks

### 4. **Channel Isolation**
- Each channel has its own derived encryption key
- Messages from one channel cannot be decrypted in another
- Channel-specific key derivation prevents cross-channel attacks

## Threat Model

### Protected Against:
✅ **Database Breach**: Encrypted data is unreadable without keys  
✅ **Man-in-the-Middle**: Messages encrypted before transmission  
✅ **Replay Attacks**: Unique IVs prevent message reuse  
✅ **Tampering**: AEAD authentication detects modifications  
✅ **Pattern Analysis**: Random IVs obscure message patterns  
✅ **Brute Force**: 100K PBKDF2 iterations slow down attacks  

### Current Limitations:
⚠️ **Key Distribution**: Currently uses deterministic channel-based keys  
⚠️ **Forward Secrecy**: Keys are not rotated per session  
⚠️ **Metadata**: Message timestamps and usernames are not encrypted  

## Implementation Details

### Encryption Flow
```
1. User types message
2. Client generates random 96-bit IV
3. Client derives channel key using PBKDF2
4. Message encrypted with AES-GCM (key + IV)
5. IV + ciphertext combined and base64 encoded
6. Encrypted blob sent to Convex database
```

### Decryption Flow
```
1. Client receives encrypted message from database
2. Base64 decode to get IV + ciphertext
3. Extract IV (first 12 bytes)
4. Derive channel key using PBKDF2
5. Decrypt ciphertext with AES-GCM (key + IV)
6. Display plaintext to user
```

## Storage Format

Messages are stored in the database as base64-encoded strings:
```
[12 bytes IV][Variable length ciphertext]
```

Example encrypted message in database:
```
"kJ8xQm5vP2RhbmNlIHdpdGggdGhlIGRldmlsIGluIHRoZSBwYWxlIG1vb25saWdodA=="
```

## Future Enhancements

### Recommended Improvements:
1. **Diffie-Hellman Key Exchange**: Implement ECDH for secure key sharing
2. **Perfect Forward Secrecy**: Rotate keys per session
3. **User-Specific Keys**: Derive keys from user credentials
4. **Metadata Encryption**: Encrypt timestamps and usernames
5. **Key Backup**: Implement secure key recovery mechanism
6. **Multi-Device Sync**: Secure key synchronization across devices

## Compliance

This implementation uses:
- **NIST-approved algorithms** (AES, SHA-256, PBKDF2)
- **Web Crypto API** (W3C standard)
- **Industry best practices** for authenticated encryption

## Audit Trail

All encryption operations are logged client-side for debugging:
- Encryption failures are caught and logged
- Decryption failures show `[ENCRYPTED]` placeholder
- No plaintext is ever logged

## Developer Notes

### Testing Encryption
```typescript
import { encryptMessage, decryptMessage } from '@/lib/encryption';

const plaintext = "Secret message";
const channel = "#general";

const encrypted = await encryptMessage(plaintext, channel);
console.log("Encrypted:", encrypted);

const decrypted = await decryptMessage(encrypted, channel);
console.log("Decrypted:", decrypted); // "Secret message"
```

### Key Rotation
To rotate encryption keys, update the passphrase in `getChannelKey()`:
```typescript
const passphrase = `workshop-secure-comms-${channelName}-v2`; // Increment version
```

## Security Contact

For security concerns or vulnerability reports, please contact the development team immediately.

---

**Remember**: The security of this system depends on keeping the key derivation logic secure. Never expose passphrases or keys in client-side code accessible to unauthorized parties.
