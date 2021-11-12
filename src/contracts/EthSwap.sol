pragma solidity >= 0.5.16;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  Token public token;
  uint public rate = 100;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Rate = # of tokens they receive for 1 ether
    // Amount of Ethereum * rate
    uint tokenAmount = msg.value * rate;

    // Require the swap has enough tokens for the purchase
    require(token.balanceOf(address(this)) >= tokenAmount);

    token.transfer(msg.sender, tokenAmount);

    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // User can't sell more than they have
    require(token.balanceOf(msg.sender) >= _amount);

    // Calculate Ether to redeem
    uint etherAmount = _amount / rate;

    require(address(this).balance >= etherAmount);

    // Perform Sale
    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(etherAmount);

    // Emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }
}