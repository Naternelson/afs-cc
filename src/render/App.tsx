import { createRoot } from "react-dom/client";
import { MainView } from "./Views/Main";
import { Layout } from "./Layout";
import { useEffect } from "react";
import { IPCChannels } from "../ipc";
import { MainLayout } from "./MainLayout";

const App = () => {
  useEffect(() => {
    console.log("Sending ping to main process");
    window.ipc.invoke(IPCChannels.PING).then((data: any) => {
      console.log(data);
    });
  }, []);
  return (
    <MainLayout>
      <MainView />
    </MainLayout>
  );
};

const root = createRoot(document.body);
root.render(<App />);
