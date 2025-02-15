// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.0;

import "src\abstract-base\AbstractCallback.sol";

contract BasicDemoL1Callback is AbstractCallback {
    event CallbackReceived(
        address indexed origin,
        address indexed sender,
        address indexed reactive_sender
    );

    constructor() payable AbstractCallback(address(0)) {}

    function callback(address sender) external {
        emit CallbackReceived(tx.origin, msg.sender, sender);
    }
}
