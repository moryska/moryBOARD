export interface EncryptedMessage {
  id: string;
  timestamp: number;
  codename: string; // Public title
  hint?: string; // Visible Public Text
  ciphertext: string; // Base64
  iv: string; // Base64
  salt: string; // Base64
  
  // Destruction Settings
  burnAfterRead: boolean; // If true, deletes after opening
  expiresAt?: number;     // If set, deletes after this timestamp
}

export enum ViewState {
  BOARD = 'BOARD',
  COMPOSE = 'COMPOSE',
  READ = 'READ',
}

export interface DecryptionResult {
  success: boolean;
  content?: string;
  error?: string;
}

export interface DestructionLog {
  id: string;
  timestamp: number;
  codename: string;
  status: 'DESTROYED' | 'EXPIRED' | 'CREATED' | 'ACCESSED' | 'PURGED' | 'SYSTEM_ERROR';
}