import React from "react";
import Identicon from "identicon.js";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 me-0 mx-3"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        EthSwap
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-sm-block">
          <span className="text-secondary">
            <span id="account">{account}</span>
          </span>
          {account ? (
            <img
              className="ms-2"
              width="30"
              height="30"
              src={`data:image/png;base64, ${new Identicon(
                account,
                30
              ).toString()}`}
              alt=""
            />
          ) : (
            <span />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
