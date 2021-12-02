import React, { useState } from "react";

import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

const Main = ({ buyTokens, sellTokens, ethBalance, tokenBalance, rate }) => {
  const [isBuyForm, setIsBuyForm] = useState(false);

  return (
    <div id="content">
      <div className="d-flex flex-row-reverse">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            onClick={() => {
              setIsBuyForm(!isBuyForm);
            }}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            {isBuyForm ? "Buying OKT" : "Selling OKT"}
          </label>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          {isBuyForm ? (
            <BuyForm
              buyTokens={buyTokens}
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
              rate={rate}
            />
          ) : (
            <SellForm
              sellTokens={sellTokens}
              ethBalance={ethBalance}
              tokenBalance={tokenBalance}
              rate={rate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
