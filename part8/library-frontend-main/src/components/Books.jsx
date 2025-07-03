import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries/queries";

const Books = (props) => {
  const [filter, setFilter] = useState(null);
  const {
    data: genreData,
    loading,
    error
  } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: filter }
  });
  const { data: allBooksData } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = genreData?.allBooks || [];

  const allGenres = allBooksData
    ? [...new Set(allBooksData.allBooks.flatMap((book) => book.genres))]
    : [];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map((g) => {
          return (
            <button onClick={() => setFilter(g)} key={g}>
              {g}
            </button>
          );
        })}
        <button key="clear_all" onClick={() => setFilter(null)}>
          Clear selection
        </button>
      </div>
    </div>
  );
};

export default Books;
