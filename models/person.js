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
  name: String,
  number: String
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
  return Person.find({}).then(result => {
    return result
  })
}

const addPerson = (person) => {
  const newPerson = new Person(person)
  return newPerson.save().then(result => {
    return result
  })
}

const updatePerson = (id, person) => {
  return Person.findByIdAndUpdate(id, person, { new: true }).then(result => {
    return result
  })
}

const deletePerson = (id) => {
  return Person.findByIdAndRemove(id).then(result => {
    return result
  })
}

module.exports = {
  getAllPersons,
  addPerson,
  updatePerson,
  deletePerson
}
