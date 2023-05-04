import { accounts } from '../../_test/constants.js'
import { address } from '../../_test/constants.js'
import { testClient } from '../../_test/utils.js'
import { walletClient } from '../../_test/utils.js'
import { parseEther } from '../../utils/unit/parseEther.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { impersonateAccount } from './impersonateAccount.js'
import { stopImpersonatingAccount } from './stopImpersonatingAccount.js'
import { expect, test } from 'vitest'

test('stops impersonating account', async () => {
  await impersonateAccount(testClient, { address: address.vitalik })

  expect(
    await sendTransaction(walletClient, {
      account: address.vitalik,
      to: accounts[0].address,
      value: parseEther('1'),
    }),
  ).toBeDefined()

  await expect(
    stopImpersonatingAccount(testClient, { address: address.vitalik }),
  ).resolves.toBeUndefined()

  await expect(
    sendTransaction(walletClient, {
      account: address.vitalik,
      to: accounts[0].address,
      value: parseEther('1'),
    }),
  ).rejects.toThrowError('No Signer available')
})
