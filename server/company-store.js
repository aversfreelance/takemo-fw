import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const file = join(root, 'data', 'company.json')

export const defaultCompany = {
  name: 'Takemo Ltd',
  address: 'Minehead, Somerset United Kingdom',
  email: 'gabor.pinter@pmonline.hu',
  website: 'takemo.co.uk',
  companyNumber: '',
  vatNumber: '',
}

function load() {
  if (!existsSync(file)) return { ...defaultCompany }
  try {
    return { ...defaultCompany, ...JSON.parse(readFileSync(file, 'utf8')) }
  } catch {
    return { ...defaultCompany }
  }
}

export async function getCompany() {
  return load()
}

export async function saveCompany(next) {
  const data = {
    name: String(next?.name || defaultCompany.name).trim(),
    address: String(next?.address || defaultCompany.address).trim(),
    email: String(next?.email || defaultCompany.email).trim(),
    website: String(next?.website || defaultCompany.website).trim(),
    companyNumber: String(next?.companyNumber ?? defaultCompany.companyNumber).trim(),
    vatNumber: String(next?.vatNumber ?? defaultCompany.vatNumber).trim(),
  }
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(data, null, 2))
  return data
}
