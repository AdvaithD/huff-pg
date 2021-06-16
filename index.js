const { Runtime } = require('huff')

const main = new Runtime('simpletoken.huff')

const calldata = [
    // calldata for macro
    { index: 0, value: new BN(1) },
    { index: 32, value: new BN(2) },
];

const initialMemory = [
    // intial memory state expected by macro
    { index: 0, value: new BN(1234134) },
    { index: 32, value: new BN(29384729832) },
];
const inputStack = [new BN(1), new BN(6)]; // initial stack state expected by macro
const callvalue = 1; // amount of wei in transaction

const {stack, memory, gas, bytecode, returnData} = await main('MACRO_NAME', initialStack, initialMemory, calldata, callvalue)