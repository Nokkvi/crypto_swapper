import chai from "chai";

const { assert } = require("chai");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("Ethswap");

chai.use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);

    // Transfer all tokens to EthSwap
    await token.transfer(ethSwap.address, tokens("1000000"));
  });

  describe("Token deployment", async () => {
    it("contract has a name", async () => {
      const token = await Token.new();
      const name = await token.name();

      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();

      assert.equal(name, "EthSwap Instant Exchange");
    });

    it("contract has tokens", async () => {
      const balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Buy tokens", async () => {
    let result;
    before(async () => {
      //Purchase tokens before each iteration
      result = await ethSwap.buyTokens({ from: investor, value: tokens("1") });
    });

    it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1"));

      // Check logs to ensure event was emitted with the correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("Sell tokens", async () => {
    let result;
    before(async () => {
      // Approve tokens
      await token.approve(ethSwap.address, tokens("100"), { from: investor });

      // Sell tokens before each iteration
      result = await ethSwap.sellTokens(tokens("100"), { from: investor });
    });

    it("Allows user to instantly purchase tokens to ethSwap for a fixed price", async () => {
      // Check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1000000"));

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("0"));

      // Check logs to ensure event was emitted with the correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");

      // FAILURE TEST: investor cannot sell more than they have
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
