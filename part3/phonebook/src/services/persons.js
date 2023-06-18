import axios from "axios"

const url = "http://localhost:3001/api/persons"

const getPersons = () => axios.get(url).then((response) => response.data)

const addPerson = (person) => axios.post(url, person).then((response) => response.data)

const deletePerson = (id) => axios.delete(`${url}/${id}`).then((response) => response.data)

const updateNumber = (person, newNumber) => {
    let updatedPerson = {...person, number: newNumber}
    return axios.put(`${url}/${person.id}`, updatedPerson).then((response) => response.data);
  };

export default { deletePerson, getPersons, addPerson, updateNumber }