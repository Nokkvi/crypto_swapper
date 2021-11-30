import React, { Component } from "react";
import Web3 from "web3";

import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";

import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      ethBalance: 0,
      tokenBalance: 0,
      rate: 0,
      loading: true,
    };
  }

  async componentDidMount() {
    await this.loadWeb3().then(async () => {
      await this.loadBlockChainData().then(() =>
        this.setState({ loading: false })
      );
    });
  }

  loadBlockChainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    console.log(ethBalance);
    this.setState({ ethBalance });

    const networkId = await web3.eth.net.getId();
    if (Token.networks[networkId]) {
      const token = new web3.eth.Contract(
        Token.abi,
        Token.networks[networkId].address
      );
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance });
    } else {
      window.alert("Token contract not deployed to detected network");
    }

    if (EthSwap.networks[networkId]) {
      const ethSwap = new web3.eth.Contract(
        EthSwap.abi,
        EthSwap.networks[networkId].address
      );
      await ethSwap.methods
        .rate()
        .call()
        .then((value, v) => this.setState({ rate: value }));
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network");
    }
  };

  buyTokens = async (ethAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods
      .buyTokens()
      .send({ from: this.state.account, value: ethAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        this.loadBlockChainData();
      });
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying Metamask!"
      );
    }
  };

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          buyTokens={this.buyTokens}
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          rate={this.state.rate}
        ></Main>
      );
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 mx-auto text-center main-wrapper"
            >
              {content}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
