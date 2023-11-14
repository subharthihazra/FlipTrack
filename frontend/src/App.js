import { useState, useReducer, useEffect } from "react";
import axios from "axios";
import "./App.css";
import logo from "./logo.png";

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
  const [formData, setFormData] = useReducer(formReducer, { searchUrl: "" });
  const [status, setStatus] = useState("normal");
  const [receivedData, setReceivedData] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
  }
  function handleSearchUrl(event) {
    setFormData({ type: "UPDATE_SEARCH_URL", payLoad: event.target.value });
  }

  useEffect(() => {
    console.log(formData);

    const controller = new AbortController();
    if (formData.searchUrl?.trim() !== "") {
      setStatus("loading");
      console.log("req");
      axios
        .post("http://localhost:5000/scrape", formData, {
          signal: controller.signal,
        })
        .then((response) => {
          setStatus("ready");
          setReceivedData(response?.data || null);
          console.log(response?.data);
        })
        .catch((error) => {
          setStatus("error");
        });
    }

    return () => {
      controller.abort();
    };
  }, [formData]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Headerbar />
      <div className="sm:w-2/3 lg:w-3/5 m-4 sm:m-auto flex flex-col gap-6">
        <form method="POST" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="search"
              placeholder="Paste any Flipkart product URL here . . ."
              onChange={handleSearchUrl}
              className="w-full py-4 px-5 shadow-lg border border-slate-200 rounded-lg 
              text-lg font-sans tracking-wide outline-0 hover:shadow-xl
               hover:border-slate-400 transition-all focus:border-slate-400"
            />
          </div>
        </form>
        <div className="w-full">
          {status === "loading" && <LoadSpinner />}
          {status === "error" && <ErrorLogo />}
          {status === "ready" && <DataView data={receivedData} />}
        </div>
      </div>
    </div>
  );
}

function LoadSpinner() {
  return (
    <div className="flex justify-center items-center h-52">
      <div className="relative inline-flex">
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
    </div>
  );
}

function ErrorLogo() {
  return (
    <div className="flex justify-center items-center h-52">
      <svg
        className="h-10 w-10 text-slate-400"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <path stroke="none" d="M0 0h24v24H0z" />{" "}
        <line x1="18" y1="6" x2="6" y2="18" />{" "}
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  );
}

function Headerbar() {
  return (
    <div className="w-screen flex py-6 place-content-center gap-4">
      <img src={logo} alt="" className="h-11 w-auto" />
      <p className="text-2xl font-sans tracking-wide place-self-center font-semibold">
        FlipTrack
      </p>
    </div>
  );
}

function DataView({ data }) {
  return (
    <div
      className="w-full p-5 shadow-md border rounded-lg text-lg font-sans tracking-wide bg-white
      grid grid-cols-1 sm:grid-cols-2 gap-8"
    >
      <div className="sm:col-span-2 place-self-center">
        {data?.productName ? data?.productName : "-"}
      </div>
      <div className="h-64 w-auto grid">
        {data?.imgUrl && (
          <img
            src={data?.imgUrl}
            alt="Product"
            className="max-h-64 place-self-center"
          />
        )}
      </div>
      <div className="place-self-center">
        <div className="text-2xl">{data?.price ? `₹${data?.price}` : "-"}</div>
        <div className="text-lg line-through text-slate-500">
          {data?.priceOriginal ? `₹${data?.priceOriginal}` : "-"}
        </div>
      </div>
      <div className="sm:col-span-2 place-self-center">
        {data?.productDescription && data?.productDescription}
      </div>
    </div>
  );
}

export default App;
