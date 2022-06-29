import "./assets/css/custom.css";
import "./assets/css/tailwind.css";
import "./assets/css/tailwind.output.css";
import "@pathofdev/react-tag-input/build/index.css";

import React, { Suspense } from "react";

import { AdminProvider } from "./context/AdminContext";
import App from "./App";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import { SidebarProvider } from "./context/SidebarContext";
import ThemeSuspense from "./components/theme/ThemeSuspense";
import { Windmill } from "@windmill/react-ui";
import myTheme from "./assets/theme/myTheme";
import store from "./Redux/store";

/**TO avoid data loss on refresh */
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
}

store.subscribe(() => saveToLocalStorage(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <AdminProvider>
      <SidebarProvider>
        <Suspense fallback={<ThemeSuspense />}>
          <Windmill usePreferences theme={myTheme}>
            <App />
          </Windmill>
        </Suspense>
      </SidebarProvider>
    </AdminProvider>
  </Provider>,

  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
