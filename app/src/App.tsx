import "./App.css";

function App() {
  const clickHandle = () =>
    (window as any).smartcard.getDevices().then((devs: string[]) => {
      console.log(devs);
    });

  return (
    <div>
      <h1>Hello World!</h1>
      <p>Bemis</p>
      <button onClick={clickHandle}>Get Devics</button>
    </div>
  );
}

export default App;
