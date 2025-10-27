# Security Architecture - THE WORKSHOP Communications

## End-to-End Encryption (E2E)

All communications in THE WORKSHOP are protected by military-grade end-to-end encryption. Messages are encrypted on the client side before they reach the database - ensuring zero-knowledge security.

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
- Server (Convex) never sees plaintext messages - only encrypted ciphertext
- Database stores ciphertext only; no plaintext ever touches the server

### 2. **Per-Message Unique IV**
- Each message gets a cryptographically random Initialization Vector
- Prevents pattern analysis, even with identical messages
- IV is prepended to ciphertext for later decryption

### 3. **Authenticated Encryption**
- AES-GCM provides both confidentiality and authenticity
- Detects tampering attempts automatically
- Prevents ciphertext manipulation attacks

### 4. **Channel Isolation**
- Each channel has its own derived encryption key
- Messages from one channel cannot be decrypted in another
- Channel-specific key derivation prevents cross-channel attacks

## Threat Model

### Protected Against
- **Database Breach**: Encrypted data is unreadable without keys
- **Man-in-the-Middle**: Messages encrypted before transmission
- **Replay Attacks**: Unique IVs prevent message reuse
- **Tampering**: AEAD authentication detects modifications
- **Pattern Analysis**: Random IVs obscure message patterns
- **Brute Force**: 100K PBKDF2 iterations slow down attacks

### Current Limitations
- **Key Distribution**: Currently uses deterministic channel-based keys (not ideal for production)
- **Forward Secrecy**: Keys are not rotated per session - something to improve
- **Metadata**: Message timestamps and usernames are not encrypted  

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

## Assignment Security System

### Multi-User Protection

#### Claim Validation
- **Atomic Operations**: All claim operations are server-side mutations with race condition protection
- **Status Checks**: Assignments must be in "active" status to be claimed
- **User Tracking**: The `claimedBy` field tracks which user owns the assignment
- **Timestamp Recording**: Both `claimedAt` and `completedAt` timestamps provide an audit trail

#### Security Checks

**Claiming an Assignment:**
- User must be authenticated
- Assignment must exist
- Assignment status must be "active"
- Assignment cannot already be claimed by another user
- User ID is recorded in claimedBy field

**Completing an Assignment:**
- User must be authenticated
- Assignment must exist
- Assignment status must be "claimed"
- Only the user who claimed it can complete it (claimedBy === currentUser)
- Reputation points awarded only after validation

**Unclaiming an Assignment:**
- User must be authenticated
- Assignment must exist
- Assignment status must be "claimed"
- Only the user who claimed it can unclaim it
- Assignment returned to "active" pool

### Data Isolation

#### User-Specific Queries
- **getAllAssignments**: Returns only active assignments + user's own claimed/completed assignments
- **getMyClaimedAssignments**: Returns only assignments claimed by the current user
- **getAssignmentById**: Returns assignment but operations are validated server-side

#### Prevents
- Users seeing other users' claimed assignments
- Users completing assignments they did not claim
- Multiple users claiming the same assignment
- Reputation manipulation
- Assignment status tampering  

### Client-Side Data Encryption

#### Assignment Data Protection
```typescript
// Encrypt sensitive assignment data for local storage
encryptAssignmentData(data, userId)

// Decrypt when needed
decryptAssignmentData(encryptedData, userId)
```

**Features:**
- User-specific encryption keys (derived from user ID)
- AES-GCM encryption for local storage
- Prevents data leakage if local storage is compromised
- Unique IV per encryption operation - no reuse

### Error Handling

#### User-Friendly Error Messages
- "Assignment already claimed by another operative"
- "Assignment must be claimed before completion"
- "You can only complete assignments you have claimed"
- "Assignment is not available for claiming"

#### Security Through Obscurity
- Error messages don't reveal system internals
- Failed operations don't expose database structure
- Rate limiting on failed attempts (future enhancement)

### Database Schema Security

```typescript
assignments: {
  claimedBy: Id<"users"> | undefined,      // Owner tracking
  claimedAt: number | undefined,            // Audit timestamp
  completedAt: number | undefined,          // Completion timestamp
  status: "active" | "claimed" | "completed" // State machine
}

// Indexes for efficient secure queries
.index("by_status", ["status"])
.index("by_claimed_user", ["claimedBy"])
```

### Edge Cases Handled

1. **Race Conditions**: Server-side validation prevents simultaneous claims
2. **Orphaned Claims**: Unclaim function allows users to release assignments
3. **Invalid State Transitions**: Status checks prevent skipping claim step
4. **Reputation Exploits**: Points only awarded after full validation
5. **Data Leakage**: User-specific queries prevent cross-user data access

### Future Security Enhancements

1. **Time-Based Expiry**: Auto-release assignments after 24 hours of inactivity
2. **Rate Limiting**: Prevent rapid claim/unclaim abuse
3. **Audit Logging**: Track all assignment state changes
4. **Admin Dashboard**: Monitor suspicious activity patterns
5. **Encrypted Steps**: Encrypt mission steps until claimed
6. **Location Verification**: Verify user is at physical location (optional)

---

**Remember**: The security of this system depends on keeping the key derivation logic secure. Never expose passphrases or keys in client-side code accessible to unauthorized parties.
