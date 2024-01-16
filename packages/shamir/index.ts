import { base64 } from '@scure/base'
import { split, combine } from 'shamir-secret-sharing'

const toUint8Array = (data: string) => new TextEncoder().encode(data)

// Example of splitting user input
//const input = document.querySelector("input#secret").value.normalize('NFKC')
const secret = toUint8Array('NFKC')
const [share1, share2, share3] = await split(secret, 3, 2)
console.log('share1', base64.encode(share1))
console.log('share2', base64.encode(share2))
console.log('share1', base64.encode(share3))
let reconstructed: Uint8Array = await combine([share1, share3])
console.log(reconstructed)
console.log(base64.encode(reconstructed) === base64.encode(secret)) // true

// Example of splitting random entropy
const randomEntropy = crypto.getRandomValues(new Uint8Array(16))
const [share4, share5, share6] = await split(randomEntropy, 3, 2)
reconstructed = await combine([share5, share6])
console.log(base64.encode(reconstructed) === base64.encode(randomEntropy)) // true

// Example of splitting symmetric key
const key = await crypto.subtle.generateKey(
  {
    name: 'AES-GCM',
    length: 256,
  },
  true,
  ['encrypt', 'decrypt'],
)
const exportedKeyBuffer = await crypto.subtle.exportKey('raw', key)
const exportedKey = new Uint8Array(exportedKeyBuffer)
const [share7, share8, share9] = await split(exportedKey, 3, 2)
reconstructed = await combine([share7, share8])
console.log(base64.encode(reconstructed) === base64.encode(exportedKey)) // true
