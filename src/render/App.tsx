import { createRoot } from "react-dom/client";
import { MainView } from "./Views/Main";
import { Layout } from "./Layout";
import { useEffect } from "react";
import { IPCChannels } from "../ipc";
import { MainLayout } from "./MainLayout";
import { ping } from "./api";

const App = () => {
  pingBackend();
  return (
    <MainLayout>
      <MainView />
    </MainLayout>
  );
};

const root = createRoot(document.body);
root.render(<App />);

const pingBackend = () => {
  useEffect(() => {
    console.log("Pinging Backend");
    ping((message) => {
      console.log("Backend response: " + message);
    });
  }, []);
};
