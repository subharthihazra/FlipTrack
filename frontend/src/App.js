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
    setStatus("loading");
  }

  useEffect(() => {
    console.log(formData);

    const controller = new AbortController();
    if (formData.searchUrl?.trim() !== "") {
      setStatus("loading");
      console.log("req");
      axios
        .post("http://fliptrack-backend.vercel.app:5000/scrape", formData, {
          signal: controller.signal,
        })
        .then((response) => {
          setStatus("ready");
          setReceivedData(response?.data || null);
          console.log(response?.data);
        })
        .catch((error) => {
          if (error?.name === "CanceledError") {
            // setStatus("normal");
          } else {
            setStatus("error");
          }
        });
    }

    return () => {
      controller.abort();
    };
  }, [formData]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100">
      <Headerbar />
      <div className="sm:w-2/3 lg:w-3/5 m-4 sm:mx-auto flex flex-col gap-6 sm:mb-auto">
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
              spellcheck="false"
            />
          </div>
        </form>
        <div className="w-full">
          {status === "ready" ? (
            <DataView data={receivedData} />
          ) : (
            <StatusView>
              {status === "loading" && <LoadSpinner />}
              {status === "error" && <ErrorLogo />}
            </StatusView>
          )}
        </div>
      </div>
      <Footerbar />
    </div>
  );
}

function StatusView({ children }) {
  return (
    <div className="flex justify-center items-center h-52">{children}</div>
  );
}

function LoadSpinner() {
  return (
    <div className="relative inline-flex">
      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
      <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
      <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
    </div>
  );
}

function ErrorLogo() {
  // return (
  //   <svg
  //     className="h-10 w-10 text-slate-400"
  //     width="24"
  //     height="24"
  //     viewBox="0 0 24 24"
  //     strokeWidth="2"
  //     stroke="currentColor"
  //     fill="none"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //   >
  //     {" "}
  //     <path stroke="none" d="M0 0h24v24H0z" />{" "}
  //     <line x1="18" y1="6" x2="6" y2="18" />{" "}
  //     <line x1="6" y1="6" x2="18" y2="18" />
  //   </svg>
  // );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={50}
      height={50}
      viewBox="0 0 60.002 60.002"
      fill="gray"
    >
      <path d="M59.795 26.568c-.401-1.697-1.364-3.156-2.576-3.902-.812-.5-1.678-.659-2.508-.461a2.784 2.784 0 0 0-.548.198c-2.336-5.685-5.98-9.364-9.727-11.736l1.36-2.719a1 1 0 0 0-1.789-.895l-1.303 2.605a27.548 27.548 0 0 0-1.838-.892l.983-2.949a1 1 0 1 0-1.897-.633l-.948 2.844a30.004 30.004 0 0 0-2.012-.642l.857-2.57a1 1 0 1 0-1.897-.633l-.908 2.724a28.66 28.66 0 0 0-3.144-.489V4.499a1 1 0 1 0-2 0v1.844c-.525.026-1.441.097-2.632.283l-.382-2.292a.995.995 0 0 0-1.15-.822 1 1 0 0 0-.822 1.15l.39 2.34a30.264 30.264 0 0 0-3.509 1.02l-.947-2.841a1 1 0 1 0-1.897.633l.981 2.944c-.863.378-1.742.822-2.621 1.327l-1.517-3.034a1.001 1.001 0 0 0-1.789.895l1.601 3.201a24.666 24.666 0 0 0-2.594 2.05l-2.405-2.405a.999.999 0 1 0-1.414 1.414l2.388 2.388c-3.076 3.272-5.646 7.835-6.826 14.213-.015.083-.025.167-.04.25a2.918 2.918 0 0 0-.776-.118C1.73 28.939 0 31.322 0 34.363s1.73 5.424 3.939 5.424c.404 0 .798-.102 1.177-.267.701 2.671 1.863 5.179 3.458 7.378 3.194 4.404 9.468 9.606 21.27 9.606.182 0 .363-.001.548-.004.185.003.365.004.548.004 11.799-.001 18.074-5.202 21.27-9.606 2.879-3.969 4.345-8.941 4.23-14.07.035.001.07.007.104.007.227 0 .451-.025.672-.078 2.147-.513 3.28-3.231 2.579-6.189zM4.674 37.489c-.206.166-.456.298-.734.298C3.022 37.786 2 36.38 2 34.363s1.022-3.424 1.939-3.424c.167 0 .335.047.504.139a25.047 25.047 0 0 0-.096 1.591l-.002.12a24.714 24.714 0 0 0 .091 2.786c.013.147.022.294.037.44.047.435.105.867.175 1.297.011.058.016.118.026.177zm45.917 8.235c-4.316 5.949-11.098 8.934-20.185 8.776h-.027c-.186.003-.369.004-.552.004-8.802 0-15.405-2.953-19.633-8.78-2.062-2.842-3.329-6.256-3.726-9.867-.008-.077-.01-.155-.017-.232A22.975 22.975 0 0 1 6.35 33.9a21.18 21.18 0 0 1 .003-.756c.004-.405.02-.811.046-1.217.02-.298.04-.596.071-.895.064-.62.138-1.241.252-1.861 1.097-5.928 3.438-10.163 6.237-13.199l1.235 1.235a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414l-1.229-1.229a22.279 22.279 0 0 1 2.095-1.683l.533 1.067a1 1 0 1 0 1.789-.894l-.628-1.256c.795-.464 1.59-.872 2.372-1.22l.413 1.24a1 1 0 1 0 1.896-.633l-.45-1.349c1.148-.407 2.236-.7 3.224-.917l.291 1.747a1 1 0 1 0 1.972-.328l-.296-1.777a22.989 22.989 0 0 1 2.31-.22v2.161a1 1 0 1 0 2 0V8.416a26.3 26.3 0 0 1 2.516.374l-.464 1.394a1 1 0 1 0 1.896.633l.522-1.567c.644.176 1.318.385 2.015.634l-.433 1.298a1 1 0 1 0 1.896.633l.395-1.185c.177.079.353.154.532.238.36.171.707.353 1.053.537l-.823 1.645a1 1 0 1 0 1.789.894l.763-1.526c4.174 2.689 7.196 6.516 9.039 11.43l-.003.003.182.513a31.345 31.345 0 0 1 .757 2.455c.204.769.382 1.548.53 2.348.122.659.204 1.318.268 1.976.012.127.029.252.04.38.421 5.171-.906 10.241-3.779 14.201zm6.16-14.912a1.033 1.033 0 0 1-.436 0c-.004-.036-.011-.07-.015-.106a25.599 25.599 0 0 0-.269-1.891l-.001-.009-.008-.035a35.115 35.115 0 0 0-.485-2.198c-.019-.075-.043-.149-.062-.224a32.664 32.664 0 0 0-.595-2.013l-.013-.045a.948.948 0 0 1 .31-.142c.381-.093.751.069.994.219.758.467 1.401 1.486 1.68 2.66.463 1.964-.206 3.571-1.1 3.784z" />
      <path d="M20 27.504c0-2.757 2.243-5 5-5a1 1 0 0 0 .707-1.707c-1.304-1.305-3.201-2.053-5.207-2.053s-3.903.748-5.207 2.053a.999.999 0 1 0 1.414 1.414c.932-.932 2.314-1.467 3.793-1.467.638 0 1.259.1 1.832.288A7.011 7.011 0 0 0 18 27.504a1 1 0 1 0 2 0zM40.5 18.744c-2.006 0-3.903.748-5.207 2.053A1 1 0 0 0 36 22.504c2.757 0 5 2.243 5 5a1 1 0 1 0 2 0 7.011 7.011 0 0 0-4.332-6.472 5.89 5.89 0 0 1 1.832-.288c1.479 0 2.861.535 3.793 1.467a.999.999 0 1 0 1.414-1.414c-1.304-1.305-3.201-2.053-5.207-2.053zM30 27.504c-6.341 0-11.5 5.383-11.5 12s5.159 12 11.5 12 11.5-5.383 11.5-12-5.159-12-11.5-12zM24.014 47.26c.142-2.898 2.769-5.217 5.986-5.217s5.844 2.319 5.986 5.217c-1.635 1.401-3.718 2.245-5.986 2.245s-4.351-.844-5.986-2.245zm13.653-1.875c-.982-3.085-4.045-5.343-7.667-5.343s-6.685 2.258-7.667 5.343a10.29 10.29 0 0 1-1.833-5.881c0-5.514 4.262-10 9.5-10s9.5 4.486 9.5 10a10.29 10.29 0 0 1-1.833 5.881z" />
    </svg>
  );
}

function Headerbar() {
  return (
    <div className="flex py-6 place-content-center gap-4">
      <img src={logo} alt="" className="h-11 w-auto" />
      <p className="text-2xl font-sans tracking-wide place-self-center font-semibold">
        FlipTrack
      </p>
    </div>
  );
}

function Footerbar() {
  return (
    <div className="flex py-6 place-content-center gap-4">
      <p className="text-md font-sans tracking-wide place-self-center">
        Created by Subharthi Hazra{" | "}
        <a
          href="https://linktr.ee/subharthihazra"
          className="text-blue-600 dark:text-blue-500 hover:underline font-semibold"
        >
          Contact Me!
        </a>
      </p>
    </div>
  );
}

function DataView({ data }) {
  return (
    <div
      className="w-full p-5 shadow-md border rounded-lg text-md font-sans tracking-wide bg-white
      grid grid-cols-1 sm:grid-cols-2 gap-8"
    >
      <div className="sm:col-span-2 place-self-center text-lg">
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
      <div className="place-self-center text-center">
        <div className="text-3xl">{data?.price ? `₹${data?.price}` : "-"}</div>
        <div className="text-xl line-through text-slate-500">
          {data?.priceOriginal ? `₹${data?.priceOriginal}` : "-"}
        </div>
      </div>
      <div className="sm:col-span-2 place-self-center">
        {data?.productDescription && data?.productDescription}
      </div>
    </div>
  );
}

function consoleLog() {
  console.log(
    `%cHey! 😀👋\nI'm Subharthi Hazra, doing B.Tech at CSE in Kolkata, India. 🏫 Currently in my second year. 🎓 I know stuff like Javascript, Node.JS, React.JS, Typescript, HTML, CSS, C, C++, Git, Linux, and a bit of Python and Rust. 🚀 I'm eager to learn more and boost my skills. 💻\n\n\n\n%cContact me: %c👇\nhttps://linktr.ee/subharthihazra\n\n\n\n%cI'm open to any new opportunity! 🌟 `,
    "color:cadetblue; font-size: 16px",
    "color:black; font-size: 18px",
    "color:blue; font-size: 18px",
    "color:darkorchid; font-size: 20px"
  );
}
consoleLog();

export default App;
