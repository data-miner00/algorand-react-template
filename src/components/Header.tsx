import React from "react";

import ThemeSwitcher from "./ThemeSwitcher";
import logo from "../assets/algorand-logo.png";

function Header(): JSX.Element {
  return (
    <header className="">
      <div className="max-w-[1400px] mx-auto md:px-8 items-center flex justify-between h-24">
        <img
          src={logo}
          alt="Algorand Logo"
          className="w-10 block dark:filter dark:invert"
        />
        <nav className="flex">
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}

export default Header;
