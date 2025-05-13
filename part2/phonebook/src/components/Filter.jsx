const Filter = ({ filter, handleFilter }) => {
  return <input value={filter} onChange={handleFilter} />;
};

export default Filter;
