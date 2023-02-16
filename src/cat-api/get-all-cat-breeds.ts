import fetch from 'node-fetch'
import memoizee from 'memoizee'
import { CatBreed, CatApiParams } from './types'

const _getAllCatBreeds = async (params: CatApiParams): Promise<CatBreed[]> => {
  const { apiKey, url } = params

  const urlWithParams = new URL(`${url}/breeds`)
  urlWithParams.searchParams.append('api_key', apiKey)

  console.log('retrieving all cat breeds from cat-api')

  const allBreeds = await fetch(urlWithParams).then((res) => res.json())

  return allBreeds as CatBreed[]
}

export const getAllCatBreeds = memoizee(_getAllCatBreeds, {
  promise: true,
  normalizer: ([params]) => `${params.url}:${params.apiKey}`,
})
