import { useState } from "react";
import { EDIT_AUTHOR } from "../queries/queries";
import { useMutation } from "@apollo/client";

const Authors = (props) => {
  if (!props.show) {
    return null;
  }
  const authors = props.authors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && <SetBirthyear authors={authors} />}
    </div>
  );
};

const SetBirthyear = ({ authors }) => {
  const [year, setYear] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const [edithAuthor] = useMutation(EDIT_AUTHOR);

  const submit = (e) => {
    e.preventDefault();
    edithAuthor({
      variables: {
        name: selectedAuthor,
        setBornTo: parseInt(year)
      }
    });
    setYear("");
    setSelectedAuthor("");
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <label>
            Select an author:
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option value="">--Please choose an option--</option>
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            born:{" "}
            <input
              value={year}
              type="number"
              onChange={({ target }) => setYear(target.value)}
            />
          </label>
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;
