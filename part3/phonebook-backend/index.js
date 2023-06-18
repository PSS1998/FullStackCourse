require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const mongoose = require('mongoose')

const app = express()

// const url = process.env.MONGODB_URI

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Person = mongoose.model('Person', personSchema)

const Person = require('./models/person')

// Create a new token for Morgan
morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())
app.use(express.static('build'))





app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// app.get('/api/persons', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(persons, null, 2));
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

const generateId = () => {
  const minId = 1
  const maxId = 1000000
  return Math.floor(Math.random() * (maxId - minId + 1) + minId)
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
  }

  // const existingPerson = persons.find((person) => person.name === body.name);
  // if (existingPerson) {
  //     return response.status(400).json({
  //     error: 'name must be unique',
  //     });
  // }



  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  // persons = persons.concat(person);

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

  // response.json(person);
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }

  // response.json(person)
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
  Person.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.get('/info', (req, res) => {
  const info = `Phonebook has info for ${Person.countDocuments({})} people\n${new Date()}`
  res.send(`<pre>${info}</pre>`)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  }).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})




const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})