import { useEffect, useState } from "react";
import { AUTH_URL, SEARCH_URL } from "./constants/APIURL";
import "./styles.css";

export default function App() {
  const [token, setToken] = useState();
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // to get the auth token
  useEffect(() => {
    const auth = async () => {
      try {
        const resp = await fetch(AUTH_URL);
        const preparedToken = await resp.json();
        setToken(preparedToken.token);
        setErrorMessage(null);
      } catch (err) {
        console.log("token", err);

        setErrorMessage(err);
      }
    };
    auth();
  }, []);

  // to get search results from input change
  useEffect(() => {
    // TODO :no fetch for empty string
    // TODO : debounce seatch
    const myHeaders = new Headers({
      "user-access-token": `${token}`
    });
    const queryString = `?search_string=${inputValue}`;
    const myRequest = new Request(`${SEARCH_URL}${queryString}`, {
      method: "GET",
      headers: myHeaders
    });
    const getSearchData = async () => {
      try {
        const resp = await fetch(myRequest);
        const preparedSearchResult = await resp.json();
        setSearchResult(preparedSearchResult);
        setErrorMessage(null);
      } catch (err) {
        console.log("data", err);
        setErrorMessage(err);
      }
    };
    getSearchData();
  }, [inputValue, token]);

  const displaySearchResult = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {searchResult.map((data) => (
          <div>{data}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <input
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      {!errorMessage ? displaySearchResult() : <h3>Some error has occured</h3>}
    </div>
  );
}
