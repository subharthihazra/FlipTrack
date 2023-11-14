import { useState, useReducer, useEffect } from "react";
import axios from "axios";
import "./App.css";

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_SEARCH_URL":
      return {
        ...state,
        searchUrl: action.payLoad,
      };
    default:
      return state;
  }
}

function App() {
  const [formData, setFormData] = useReducer(formReducer, { searchUrl: null });
  const [status, setStatus] = useState("ready");

  function handleSubmit(event) {
    event.preventDefault();
    setFormData({ type: "UPDATE_SEARCH_URL", payLoad: event.taget.value });
  }

  useEffect(() => {
    setStatus("loading");
    axios
      .post("http://localhost:5000/scrape", formData)
      .then((response) => {
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("ready");
      });
  }, [formData]);

  return (
    <div className="w-2/3 m-auto mt-4">
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Search . . ."
          className="w-full py-4 px-5 shadow-lg border border-slate-200 rounded-lg text-lg font-sans tracking-wide outline-0 hover:shadow-xl hover:border-slate-400 transition-all focus:border-slate-400"
        />
      </form>
    </div>
  );
}

export default App;
