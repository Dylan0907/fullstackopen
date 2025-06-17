import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!name) return;
    async function fetchdata() {
      setStatus("loading");
      try {
        const res = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        );
        setStatus("success");
        setCountry(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus("error");
        setCountry(null);
      }
    }

    fetchdata();
  }, [name]);
  return {
    idle: status === "idle",
    loading: status === "loading",
    error: status === "error",
    found: status === "success",
    data: country && {
      name: country.name.common,
      capital: country.capital[0],
      population: country.population,
      flag: country.flags.svg
    }
  };
};

const Country = ({ country }) => {
  if (country.idle) {
    return null;
  }
  if (country.loading) {
    return <div>Loading...</div>;
  }

  if (country.error || !country.found) {
    return <div>not found...</div>;
  }
  const { name, capital, population, flag } = country.data;
  return (
    <div>
      <h3>{name} </h3>
      <div>capital {capital} </div>
      <div>population {population}</div>
      <img src={flag} height="100" alt={`flag of ${name}`} />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState(null);
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
