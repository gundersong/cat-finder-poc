import { CatBreed } from './types'
import { getCatApiConfig } from './get-config'
import { getAllCatBreeds } from './get-all-cat-breeds'

type GetTopCatBreedsParams = {
  limit?: number
}

const getBreedScore = (breed: CatBreed) => {
  const {
    child_friendly: childFriendly,
    dog_friendly: dogFriendly,
    stranger_friendly: strangerFriendly,
  } = breed

  const score = childFriendly + dogFriendly + strangerFriendly
  return score
}

const sortCatBreedsByScore = (allBreeds: CatBreed[]): CatBreed[] => {
  const topBreeds = allBreeds.sort((a, b) => {
    const aScore = getBreedScore(a)
    const bScore = getBreedScore(b)
    if (aScore > bScore) return -1
    if (aScore < bScore) return 1
    return 0
  })

  return topBreeds
}

export const getTopCatBreeds = async (params: GetTopCatBreedsParams) => {
  const { limit } = params

  const config = await getCatApiConfig()

  const allCatBreeds = await getAllCatBreeds(config)

  const sortedCatBreeds = sortCatBreedsByScore(allCatBreeds)

  return sortedCatBreeds.slice(0, limit)
}
