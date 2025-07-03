import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries/queries";

const Recommended = ({ show }) => {
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError
  } = useQuery(ALL_BOOKS);
  const {
    data: userData,
    loading: userLoading,
    error: userError
  } = useQuery(ME);

  if (!show) {
    return null;
  }

  if (booksLoading || userLoading) return <div>Loading...</div>;
  if (booksError) return <div>Error loading books</div>;
  if (userError) return <div>Error loading user info</div>;

  if (!userData || !userData.me) return <div>No user data</div>;

  const user = userData.me;

  const books = booksData.allBooks.filter((book) =>
    book.genres.includes(user.favoriteGenre)
  );

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favourite genre <b>{user.favoriteGenre}</b>
      </p>
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
    </div>
  );
};

export default Recommended;
