import {
  Client,
  Change,
  Attribute,
  InvalidCredentialsError,
  UnwillingToPerformError
} from 'ldapts'
import { encodePassword } from './encodePassword'

const ldapClient = new Client({
  url: process.env.AD_URL || 'ldaps://10.1.0.16',
  tlsOptions: {
    requestCert: true
  }
})

const adminUser = process.env.AD_BIND_USER || ''
const adminPassword = process.env.AD_BIND_PASSWORD || ''
const baseDN = process.env.AD_BASE_DN || ''

async function getUserDN(username: string): Promise<string> {
  try {
    await ldapClient.bind(adminUser, adminPassword)

    const { searchEntries } = await ldapClient.search(baseDN, {
      attributes: ['dn'],
      filter: `(sAMAccountName=${username})`
    })

    return searchEntries[0]?.dn
  } catch (err) {
    console.error('Error finding user:', err)
  } finally {
    await ldapClient.unbind()
  }

  throw new Error('User not found')
}

export async function updatePassword({
  username,
  password,
  newPassword
}: {
  username: string
  password: string
  newPassword: string
}): Promise<'SUCCESS' | 'FAIL'> {
  try {
    const userDN = await getUserDN(username)

    // Check if user can bind with current password
    await ldapClient.bind(userDN, password)
    await ldapClient.unbind()

    // Bind with admin user to change password
    await ldapClient.bind(adminUser, adminPassword)

    await ldapClient.modify(userDN, [
      new Change({
        operation: 'replace',
        modification: new Attribute({
          type: 'unicodePwd',
          values: [encodePassword(newPassword)]
        })
      })
      // new Change({
      //   operation: 'delete',
      //   modification: new Attribute({
      //     type: 'unicodePwd',
      //     values: [encodePassword(password)]
      //   })
      // }),

      // new Change({
      //   operation: 'add',
      //   modification: new Attribute({
      //     type: 'unicodePwd',
      //     values: [encodePassword(newPassword)]
      //   })
      // })
    ])

    return 'SUCCESS'
  } catch (err: any) {
    if (err instanceof InvalidCredentialsError) {
      throw new Error('Usuário ou senha atual incorreta.')
    }

    if (err instanceof UnwillingToPerformError) {
      throw new Error(
        'A senha atual está correta, mas o servidor recusou a alteração. Verifique se a nova senha atende aos requisitos de complexidade.'
      )
    }

    console.log('Unexpected error:', err)
    throw err
  } finally {
    await ldapClient.unbind()
  }
}
