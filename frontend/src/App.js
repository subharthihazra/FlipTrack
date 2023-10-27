import "./App.css";

function App() {
  function handleSubmit(event) {
    event.preventDefault();
  }
  return (
    <div>
      <form
        method="POST"
        action="http://localhost:3000"
        onSubmit={handleSubmit}
      ></form>
    </div>
  );
}

export default App;
