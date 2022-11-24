import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import "./App.css";

const Home = lazy(async () => await import("./pages/Home"));
const Profile = lazy(async () => await import("./pages/Profile"));
const About = lazy(async () => await import("./pages/About"));
const NotFound = lazy(async () => await import("./pages/NotFound"));

const App = (): JSX.Element => (
  <div>
    <Header />
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  </div>
);

export default App;
