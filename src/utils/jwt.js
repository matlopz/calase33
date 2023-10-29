const jwt = require('jsonwebtoken')

const secretKey = 'secreto'

const generateToken = user => {
  console.log('que tiene user jwt:', {user})
  return jwt.sign({ user }, secretKey)
  
}

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('que tiene header: ',authHeader)

  if (!authHeader)
    return res.status(401).json({ status: 'error', error: 'Nooooo' })

  const token = authHeader.split(' ')[1]

  jwt.verify(token, secretKey, (error, credentials) => {
    if (error)
      return res.status(403).json({ status: 'error', error: 'Forbidden' })

    req.user = credentials.user
    next()
  })
}

module.exports = {
  generateToken,
  authToken,
}
