import { useState, useEffect } from 'react'
import Contacts from './components/Contacts'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([]) 
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    personsService.getPersons().then((data) => setPersons(data));
  }, []);

  const addContact = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        // let updatedPersons = [ ...persons ]
        let updatedPersons = JSON.parse(JSON.stringify(persons));
        updatedPersons[persons.findIndex(person => person.name === newName)].number = newNumber
        personsService.updateNumber(persons.find(person => person.name === newName), newNumber).then((data) => {
          setPersons(updatedPersons)
          setNotificationMessage(`Updated ${newName} Number`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 5000)
        }).catch((err) => {
          setNotificationMessage(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 5000)
        });
      }
    }
    else{
      personsService.addPerson(personObject).then((data) => setPersons(persons.concat(data)));
      setNotificationMessage(`Added ${newName}`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNumberFiltered = (event) => {
    setFilterName(event.target.value)
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      <h2>Phonebook</h2>
      <Filter filter={filterName} handleFilterChange={handleNumberFiltered} />
      <h2>Add a new</h2>
      <PersonForm addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Contacts persons={(filterName !== "") ? filteredPersons : persons} setPersons={setPersons} />
    </div>
  )
}

export default App