const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

const getAllPersons = () => {
  return Person.find({})
}

const addPerson = (person) => {
  const newPerson = new Person(person)
  return newPerson.save()
}

const updatePerson = (id, person) => {
  return Person.findByIdAndUpdate(id, person, { new: true })
}

const deletePerson = (id) => {
  return Person.findByIdAndRemove(id)
}

module.exports = {
  getAllPersons,
  addPerson,
  updatePerson,
  deletePerson
}
