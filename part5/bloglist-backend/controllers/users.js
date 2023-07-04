const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (_request, response) =>
  response.json(
    await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    })
  )
);

router.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'invalid password'
    })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username already exists'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = router
