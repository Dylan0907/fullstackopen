import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import {
  ALL_AUTHORS,
  BOOK_ADDED,
  ALL_BOOKS,
  BOOKS_BY_GENRE
} from "./queries/queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_AUTHORS);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      notify(`${addedBook.title} added`);

      client.refetchQueries({
        include: [ALL_BOOKS, ALL_AUTHORS, BOOKS_BY_GENRE]
      });
    }
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("books-user-token");
    if (savedToken) setToken(savedToken);
  }, []);

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("books-user-token");
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
      />

      <Authors
        show={page === "authors"}
        authors={result.data.allAuthors}
        token={token}
      />

      <Recommended show={page === "recommended"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setError={notify} />
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
