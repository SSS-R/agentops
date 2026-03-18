/**
 * VAPID Keys Utility
 * 
 * Generate and manage VAPID keys for Web Push.
 * 
 * Usage:
 * 1. Run this script once to generate keys
 * 2. Copy the keys to .env file
 * 3. Use the keys in the notification routes
 */

import webPush from 'web-push';

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

/**
 * Generate new VAPID keys
 */
export function generateVapidKeys(): VapidKeys {
  const keys = webPush.generateVAPIDKeys();
  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  };
}

/**
 * Get VAPID keys from environment or generate new ones
 */
export function getVapidKeys(): VapidKeys {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (publicKey && privateKey) {
    return { publicKey, privateKey };
  }

  // Generate new keys if not in environment
  console.warn('VAPID keys not found in environment. Generating new keys...');
  console.warn('Copy these to your .env file:');
  
  const keys = generateVapidKeys();
  console.warn(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
  console.warn(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
  
  return keys;
}

/**
 * Print VAPID keys to console (for initial setup)
 */
export function printVapidKeys(): void {
  const keys = getVapidKeys();
  console.log('\n=== VAPID Keys ===');
  console.log(`Public Key: ${keys.publicKey}`);
  console.log(`Private Key: ${keys.privateKey}`);
  console.log('\nAdd these to your .env file as VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY\n');
}

// If run directly, print keys
if (require.main === module) {
  printVapidKeys();
}
