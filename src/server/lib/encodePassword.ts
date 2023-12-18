function encodePassword(password: string): string {
  let encodedPassword = ''
  password = '"' + password + '"'

  for (let i = 0; i < password.length; i++)
    encodedPassword += String.fromCharCode(
      password.charCodeAt(i) & 0xff,
      (password.charCodeAt(i) >>> 8) & 0xff
    )

  return encodedPassword
}

export { encodePassword }
