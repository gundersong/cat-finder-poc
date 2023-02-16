import memoizee from 'memoizee'
import { SecretsManager } from '@aws-sdk/client-secrets-manager'

import { CatApiParams } from './types'

const secretManager = new SecretsManager({
  maxAttempts: 2,
  region: process.env.AWS_REGION,
})

const getConfigFromEnv = (): CatApiParams | null => {
  const { CAT_API_URL: url, CAT_API_KEY: apiKey } = process.env

  if (url && apiKey) {
    console.log('using cat-api config from env')
    return { url, apiKey }
  }

  return null
}

const _getCatApiConfig = async (): Promise<CatApiParams> => {
  const envConfig = getConfigFromEnv()
  if (envConfig) return envConfig

  console.log(
    `getting cat-api config from secret manager ${process.env.STAGE}/cat-api`,
  )

  const catApiSecret = await secretManager
    .getSecretValue({ SecretId: `${process.env.STAGE}/cat-api` })
    .then((value) => JSON.parse(value.SecretString ?? ''))
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to retrieve cat-api secret')
    })

  return catApiSecret
}

export const getCatApiConfig = memoizee(_getCatApiConfig, { promise: true })
