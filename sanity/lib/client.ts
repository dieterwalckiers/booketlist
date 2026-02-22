import { ClientConfig, createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const getClient = (config?: ClientConfig) => {
  return createClient(
    config || {
      apiVersion,
      dataset,
      projectId,
      useCdn,
    }
  )
}

export const client = getClient()
