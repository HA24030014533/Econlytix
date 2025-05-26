import { NavbarDemo } from "components/ui/resizable-navbar-demo";
import React from "react";

const Header = ({ isHomepage }) => {
  return (
    <header className="header">
      <NavbarDemo isHomepage={isHomepage} />
    </header>
  );
};

export default Header;
