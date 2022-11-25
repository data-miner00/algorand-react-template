import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import "./App.css";

const Home = lazy(async () => await import("./pages/Home"));
const NotFound = lazy(async () => await import("./pages/NotFound"));

const App = (): JSX.Element => (
  <div>
    <Header />
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  </div>
);

export default App;
