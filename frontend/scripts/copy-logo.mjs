import { copyFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = 'C:\\Users\\PC\\.gemini\\antigravity\\brain\\90e90b12-9093-4197-abf7-9c7328a36702\\kidfit_logo_1773037752782.png'
const dest = join(__dirname, '..', 'public', 'logo.png')

try {
    copyFileSync(src, dest)
    console.log('✅ Logo copied to public/logo.png')
} catch (e) {
    console.error('❌', e.message)
}
