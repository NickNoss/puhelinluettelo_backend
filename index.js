require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


morgan.token('req-body', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :req-body'))
app.use(cors())
app.use(express.static('build'))


  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    }).catch(error => {
      console.log(error)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
    })
  })

  app.get('/info', (request, response) => {
    Person.countDocuments({})
    .then(count => {
      const date = new Date()
      response.send(`Phonebook has info for ${count} people<br><br>${date}`)
  }).catch(error => {
    console.log(error)
  })
})

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
    })
  })
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save()
      .then(savedPerson => {
        response.json(savedPerson.toJSON())
      })
      .catch(error => {
        console.log(error)
        response.status(500).end()
      })
  })
  


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})