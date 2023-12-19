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

    const userDN = searchEntries[0]?.dn

    if (!userDN) throw new InvalidCredentialsError('Usuário não encontrado')

    return userDN
  } catch (err) {
    console.error('Error finding user:', err)
    throw err
  } finally {
    await ldapClient.unbind()
  }
}

export async function updatePassword({
  username,
  currentPassword,
  newPassword
}: {
  username: string
  currentPassword: string
  newPassword: string
}): Promise<'SUCCESS' | 'FAIL'> {
  try {
    const userDN = await getUserDN(username)

    // Check if user can bind with current password
    await ldapClient.bind(userDN, currentPassword)
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
      //     values: [encodePassword(currentPassword)]
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
