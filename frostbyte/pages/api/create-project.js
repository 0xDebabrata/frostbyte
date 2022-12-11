// TODO: Protect API route
// TODO: Get user_id from request
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const algorithm = "aes-256-cbc"
const key = new Buffer.from(process.env.AES_KEY, "hex")

const encrypt = (text) => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = cipher.update(text, "utf-8", "hex") + cipher.final("hex")
  return { encrypted, iv: iv.toString("hex") }
}

/*
const decrypt = (hexEncrypted) => {
  // Get iv from database
  const decipher = createDecipheriv(algorithm, key, iv)
  decipher.setAutoPadding(false)
  const decrypted = decipher.update(hexEncrypted, "hex", "utf-8") + decipher.final("utf8")
  return decrypted
}
*/

export default async function handler(req, res) {
  const { name, url, secret } = req.body

  if (!name || !url || !secret) {
    res.status(404).json({ error: "Insufficient data" })
    return;
  }

  return new Promise((resolve, reject) => {
    randomBytes(16, (err, buf) => {
      if (err) {
        res.status(500).json({ error: err })
        reject()
      } else {
        // Generate project API key for Frostbyte
        const apiKey = `frost_${buf.toString("hex")}`
        const { encrypted: encrypted_secret, iv } = encrypt(secret)
        res.status(200).json({ key: apiKey, encrypted: encrypted_secret, iv })
        resolve()
      }
    })
  })

}

