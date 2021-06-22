// Heavily inspired and a modulated version of huff's erc20 interface for testing
// https://github.com/AztecProtocol/huff/blog/master/example/erc20/erc20_interface.js

const {compiler, parser, Runtime} = require('@aztec/huff')
const BigNumber = require('bn.js')
const log = require('npmlog')
const config = require('../config')

// create runtime with the huff contract in context
const erc20Runtime = new Runtime.Runtime('../simpletoken.huff', __dirname)
// create a vm (spawns an ethereumjs-vm instance)
const vm = Runtime.getNewVM()

// coerce return data to a BigNumber
const coerceToBn = (data) => {
    return new BigNumber(data.returnValue.toString('hex'), 16)
}

// log each opcode
if (config.shouldLogSteps) {
    vm.on('step', (step) => {
        log.info('step', `OPCODE: ${step.opcode.name} | Stack: ${step.stack}`)
    })
}

const initialize = async (caller) => {
    const initMemory = []
    const initStack = []
    const initCalldata = []
    const callValue = 0

    await erc20Runtime(vm, 'ERC20', initStack, initMemory, initCalldata, callValue, caller)
}

const totalSupply = async () => {
    const calldata = [{index: 0, value: 0x18160ddd, len: 4}]
    const initMemory = []
    const stack = []
    const callValue = 0
    const callerAddr = 0;
    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, callerAddr)
    
    log.info('GAS', `Gas used by totalSupply(): ${data.gas}`)
    return coerceToBn(data) // convert return val to a bigint
}

const balanceOf = async (_owner) => {
    const calldata = [
        {index: 0, value: 0x70a08231, len: 4},
        {index: 4, value: _owner, len: 32}
    ]

    const initMemory = []
    const stack = []
    const callValue = 0
    const callerAddr = 0;
    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, callerAddr)

    log.info('GAS', `Gas used by balanceOf(): ${data.gas}`)
    return coerceToBn(data)
}

const transfer = async (caller, to, value) => {
    const calldata = [
        { index: 0, value: 0xa9059cbb, len: 4 },
        { index: 4, value: to, len: 32 },
        { index: 36, value, len: 32 }
    ];
    const initMemory = []
    const stack = []
    const callValue = 0

    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, caller)
    log.info('GAS', `Gas used by transfer(): ${data.gas}`)
}

const mint = async (caller, to, value) => {
    const calldata = [
        { index: 0, value: 0x40c10f19, len: 4 },
        { index: 4, value: to, len: 32 },
        { index: 36, value, len: 32 }
    ];
    const initMemory = []
    const stack = []
    const callValue = 0
    const callerAddress = caller

    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, callerAddress)
    log.info('GAS', `Gas used by mint(): ${data.gas}`)
}

const getAllowance = async (owner, spender) => {
    const calldata = [
        { index: 0, value: 0xdd62ed3e, len: 4 },
        { index: 4, value: owner, len: 32 },
        { index: 36, value: spender, len: 32 }
    ];
    const initMemory = []
    const stack = []
    const callValue = 0
    const callerAddress = 0

    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, callerAddress);

    log.info('GAS', `Gas used by getAllowance(): ${data.gas}`)
    return coerceToBn(data)
}

const approve = async (caller, spender, amount) => {
    const calldata = [
        { index: 0, value: 0x095ea7b3, len: 4 },
        { index: 4, value: spender, len: 32 },
        { index: 36, value: amount, len: 32 }
    ];
    const initMemory = []
    const stack = []
    const callValue = 0;
    const callerAddress = caller;

    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, callerAddress);
    log.info('GAS', `Gas used by approve(): ${data.gas}`)
}

const transferFrom = async (caller, owner, recipient, amount) => {
    const calldata = [
        { index: 0, value: 0x23b872dd, len: 4 },
        { index: 4, value: owner, len: 32 },
        { index: 36, value: recipient, len: 32 },
        { index: 68, value: amount, len: 32 }
    ];

    const initMemory = []
    const stack = []
    const callValue = 0;

    const data = await erc20Runtime(vm, 'ERC20__MAIN', stack, initMemory, calldata, callValue, caller);
    log.info('GAS', `Gas used by transferFrom(): ${data.gas}`)
}


module.exports = {
    initialize,
    totalSupply,
    balanceOf,
    transfer,
    mint,
    getAllowance,
    approve,
    transferFrom
}