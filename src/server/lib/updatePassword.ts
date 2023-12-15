import { Client, Change, Attribute } from 'ldapts'
import { encodePassword } from './encodePassword'

const ldapClient = new Client({
  url: process.env.LDAP_URL || 'ldap://10.1.0.16'
})

const bindUser = process.env.AD_BIND_USER || ''
const bindPassword = process.env.AD_BIND_PASSWORD || ''
const baseDN = process.env.AD_BASE_DN || ''

async function getUserDN(username: string): Promise<string> {
  try {
    await ldapClient.bind(bindUser, bindPassword)

    const { searchEntries } = await ldapClient.search(baseDN, {
      scope: 'sub',
      attributes: ['dn'],
      filter: `(sAMAccountName=${username})`
    })

    return searchEntries[0]?.dn
  } catch (err) {
    console.error(err)
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
}) {
  try {
    const userDN = await getUserDN(username)
    await ldapClient.bind(userDN, password)

    await ldapClient.modify(userDN, [
      new Change({
        operation: 'delete',
        modification: new Attribute({
          type: 'unicodePwd',
          values: [encodePassword(password)]
        })
      }),
      new Change({
        operation: 'add',
        modification: new Attribute({
          type: 'unicodePwd',
          values: [encodePassword(newPassword)]
        })
      })
    ])
  } catch (err) {
    console.error(err)
  } finally {
    await ldapClient.unbind()
  }
}
