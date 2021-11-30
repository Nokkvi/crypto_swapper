import React, { useState, useEffect } from "react";

import TokenLogo from "../assets/svg/Token.svg";
import EthLogo from "../assets/svg/Ethereum.svg";

const Main = ({ buyTokens, ethBalance, tokenBalance, rate }) => {
  const [input, setInput] = useState(0);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    const calculateOutput = () => {
      return input ? input * rate : 0;
    };

    setOutput(calculateOutput);
  }, [input, rate]);

  return (
    <div id="content">
      <div className="card mb-4">
        <div className="card-body">
          <form
            className="mb-3"
            onSubmit={(event) => {
              event.preventDefault();
              let etherAmount;
              etherAmount = input.toString();
              etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
              buyTokens(etherAmount);
            }}
          >
            <div>
              <label className="float-left">
                <b>Input</b>
              </label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="number"
                onChange={(e) => {
                  console.log(e.target.value);
                  const ethAmount =
                    e.target.value === "" || Number.isNaN(e.target.value)
                      ? 0
                      : parseFloat(e.target.value);
                  const parsedBalance = window.web3.utils.fromWei(
                    ethBalance,
                    "Ether"
                  );
                  if (parsedBalance < ethAmount) {
                    setInput(parsedBalance);
                  } else {
                    setInput(ethAmount);
                  }
                }}
                className="form-control form-control-lg"
                placeholder="0"
                value={
                  Number(input) > 0
                    ? Number.parseFloat(input).toString()
                    : input
                }
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={EthLogo} height="32" alt="" />
                  &nbsp; ETH
                </div>
              </div>
            </div>
            <div>
              <label className="float-left">
                <b>Output</b>
              </label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(tokenBalance, "Ether")}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                value={output}
                disabled
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img className="mx-1" src={TokenLogo} height="32" alt="" />
                  &nbsp; OKT
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="float-left text-muted">Exchange Rate</span>
              <span className="float-right text-muted">
                1 ETH = {rate} DApp
              </span>
            </div>
            <div className="d-grid col-10 mx-auto">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!input}
              >
                SWAP!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Main;
