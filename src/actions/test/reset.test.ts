import { forkBlockNumber } from '../../_test/constants.js'
import { publicClient } from '../../_test/utils.js'
import { testClient } from '../../_test/utils.js'
import { getBlockNumber } from '../public/getBlockNumber.js'
import { mine } from './mine.js'
import { reset } from './reset.js'
import { setIntervalMining } from './setIntervalMining.js'
import { expect, test } from 'vitest'

test('resets the fork', async () => {
  await setIntervalMining(testClient, { interval: 0 })
  await mine(testClient, { blocks: 10 })
  await expect(
    reset(testClient, {
      blockNumber: forkBlockNumber,
    }),
  ).resolves.toBeUndefined()
  expect(await getBlockNumber(publicClient)).toBe(forkBlockNumber)
  await setIntervalMining(testClient, { interval: 1 })
  await mine(testClient, { blocks: 1 })
})
