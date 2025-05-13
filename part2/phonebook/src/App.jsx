import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((res) => setPersons(res));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const alreadyExists = persons.filter((person) => person.name === newName);
    if (alreadyExists.length) {
      const confirmChange = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );
      if (confirmChange) {
        const changedPerson = { ...alreadyExists[0], number: newNumber };
        personService.change(changedPerson.id, changedPerson).then(() => {
          setPersons(
            persons.map((prev) =>
              prev.id === changedPerson.id ? changedPerson : prev
            )
          );
          setNewName("");
          setNewNumber("");
        });
        return;
      }
      return;
    }
    personService
      .post({
        name: newName,
        number: newNumber,
        id: crypto.randomUUID()
      })
      .then((person) => {
        setPersons(persons.concat(person));
        setNewName("");
        setNewNumber("");
      });
  };

  const removePerson = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (confirmDelete)
      personService.remove(id).then((deletedPerson) => {
        setPersons(persons.filter((person) => person.id !== deletedPerson.id));
      });
  };

  const filteredpersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        value={filter}
        handleFilter={(event) => setFilter(event.target.value)}
      />
      <h3>Add a new</h3>
      <PersonForm
        handleNewName={(event) => setNewName(event.target.value)}
        handleNewNumber={(event) => setNewNumber(event.target.value)}
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons filteredpersons={filteredpersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
