import { DiffieHellman, createCipheriv, createDecipheriv, createDiffieHellman, randomBytes, scryptSync } from 'crypto';

const sessionId: string = randomBytes(16).toString('hex');
console.log('sessionId', sessionId);
const serverDH = createDiffieHellman(100);
console.log('serverDH', serverDH);
const prime = serverDH.getPrime();
console.log('prime', prime.toString('hex'));
const generator = serverDH.getGenerator();
console.log('generator', generator.toString('hex'));
const keys = serverDH.generateKeys();
console.log('keys', keys);
const serverPublicKey = serverDH.
    