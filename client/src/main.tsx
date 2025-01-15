import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "./components/ui/toaster.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <App />
                <Toaster />
            </Provider>
        </HelmetProvider>
    </StrictMode>
);
