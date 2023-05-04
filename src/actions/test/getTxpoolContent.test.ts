import { sendTransaction } from '../wallet/sendTransaction.js'
import { expect, test } from 'vitest'

import { accounts } from '../../_test/constants.js'
import { testClient } from '../../_test/utils.js'
import { walletClient } from '../../_test/utils.js'
import { parseEther } from '../../utils/unit/parseEther.js'
import { getTxpoolContent } from './getTxpoolContent.js'
import { mine } from './mine.js'

test('gets txpool content (empty)', async () => {
  await mine(testClient, { blocks: 1 })

  expect(await getTxpoolContent(testClient)).toMatchInlineSnapshot(`
    {
      "pending": {},
      "queued": {},
    }
  `)
})

test('gets txpool content (pending)', async () => {
  await sendTransaction(walletClient, {
    account: accounts[0].address,
    to: accounts[1].address,
    value: parseEther('2'),
  })
  await sendTransaction(walletClient, {
    account: accounts[2].address,
    to: accounts[3].address,
    value: parseEther('3'),
  })
  const content1 = await getTxpoolContent(testClient)
  expect(Object.values(content1.pending).length).toBe(2)
  expect(Object.values(content1.queued).length).toBe(0)
  expect(content1.pending[accounts[0].address]).toBeDefined()
  expect(content1.pending[accounts[2].address]).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const content2 = await getTxpoolContent(testClient)
  expect(Object.values(content2.pending).length).toBe(0)
  expect(Object.values(content2.queued).length).toBe(0)
  expect(content2.pending[accounts[0].address]).toBeUndefined()
  expect(content2.pending[accounts[2].address]).toBeUndefined()
})
