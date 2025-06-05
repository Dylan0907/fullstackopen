import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";
const Filter = () => {
  const dispatch = useDispatch();
  const style = {
    marginBottom: 10
  };
  const handleChange = (event) => {
    dispatch(filterChange(event.target.value));
  };
  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
