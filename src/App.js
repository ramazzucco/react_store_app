import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppStore from "./_store/app-store";

import "./App.css";

import Header from "./layout/header/Header";
import Toast from "./components/toast/Toast";

export default function App() {
  const [theme, setTheme] = React.useState('');

  useEffect(() => {
    AppStore.themeState$.subscribe(state => {
      if(state) setTheme(state.value);
    });
  }, []);

  return (
    <div className={`App ${theme}`}>
      <Header />
      <Toast />
      <Outlet />
    </div>
  );
}
