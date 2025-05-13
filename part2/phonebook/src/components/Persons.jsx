const Persons = ({ filteredpersons, removePerson }) => {
  return (
    <>
      {filteredpersons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person.id, person.name)}>
            delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Persons;
