import {
  Client,
  Change,
  Attribute,
  InvalidCredentialsError,
  UnwillingToPerformError,
  NoSuchObjectError
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

    if (!userDN) throw new NoSuchObjectError('Usuário não encontrado')

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
  if (!username || !currentPassword || !newPassword)
    throw new Error('Informe o usuário, senha antiga e senha nova.')

  console.log(`\n*** Updating password for ${username} ***`)

  if (currentPassword === newPassword)
    throw new Error('A nova senha não pode ser igual à senha antiga.')

  try {
    const userDN = await getUserDN(username)

    let oldPasswordOK = false

    try {
      // Check if user can bind with current password
      await ldapClient.bind(userDN, currentPassword)
      oldPasswordOK = true
    } catch (err: any) {
      console.log(err.message)

      // Verify if is a ERROR_PASSWORD_MUST_CHANGE error
      if (err.message.includes('data 773')) {
        console.log('*** Password must change flag ON')
        oldPasswordOK = true
      }
      // Verify if is a ERROR_PASSWORD_EXPIRED error
      if (err.message.includes('data 532')) {
        console.log('*** Password expired')
        oldPasswordOK = true
      }
    } finally {
      await ldapClient.unbind()
    }

    if (!oldPasswordOK) {
      console.log('*** Current password is incorrect ***')
      throw new InvalidCredentialsError('Current password is incorrect')
    }
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
    ])

    console.log(`*** Password updated successfully for ${username} ***`)

    return 'SUCCESS'
  } catch (err: any) {
    if (err instanceof NoSuchObjectError) {
      console.log(`Usuário ${username} não encontrado.`)
      throw new Error('Usuário inexistente ou senha atual incorreta.')
    }

    if (err.message.includes('data 533'))
      throw new Error('Usuário desativado. Procure o SERTI do seu campus.')

    if (err.message.includes('data 701'))
      throw new Error('Usuário expirou. Procure o SERTI do seu campus.')

    if (err.message.includes('data 775'))
      throw new Error('Usuário bloqueado. Procure o SERTI do seu campus.')

    if (err instanceof InvalidCredentialsError) {
      console.log(`*** InvalidCredentialsError for ${username} ***`)
      throw new Error('Usuário inexistente ou senha atual incorreta.')
    }

    if (err instanceof UnwillingToPerformError) {
      console.log('*** UnwillingToPerformError ***')
      throw new Error(
        'A senha atual está correta, mas o servidor recusou a alteração. Verifique se a nova senha atende aos requisitos de complexidade. Não reutilize senhas antigas.'
      )
    }

    console.log('Unexpected error:', err)
    throw err
  } finally {
    console.log('*** Finished updating password ***\n')
    await ldapClient.unbind()
  }
}
