import personsService from '../services/persons'

const Contacts = ({persons, setPersons}) => {
  console.log(persons)
    const handleDeletePerson = (id) => () => {
        if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)){
            personsService.deletePerson(id).then((data) => setPersons(persons.filter(person => person.id !== id)))
        }
    }

    return (
      <div>
        {persons.map(person => <p key={person.name}>{person.name} {person.number} <button onClick={handleDeletePerson(person.id)} >delete</button></p>)}
      </div>
    )
}

export default Contacts