const Filter = ({ filter, handleFilter }) => {
  return (
    <>
      Filter shown with
      <input value={filter} onChange={handleFilter} />
    </>
  );
};

export default Filter;
