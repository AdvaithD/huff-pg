### **Huff playground**

Huff is a low-level programming language used to instrument macros inside of an EVM. This repo serves as a playground towards learning huff and lower level EVM details.
#### **Introduction**

Huff was created while writing a zk proof library (weierstrudel). At the time, this was something that could not be done in solidity.

Huff is about as close as you can get to the EVM in terms of assembly code.

- Most huff programs are macros, which can contain more macros or evm opcodes.
- When a macro is invoked, template params are supplied to the macro.
- Huff doesn't have functions or variables
- Ultimately, if your goal is to write gas-efficient contracts, huff is the way to go.

### **Instructions**

1. Clone repo, run `yarn install`
2. To run tests, run `yarn test`
3. If you'd like to see OPCODES and stack logged on each interaction, modify `shouldLogSteps` in `config.js` to `true`.

Expected output:

```
  Simpletoken - ERC20 in Huff
info GAS Gas used by balanceOf(): 422
info GAS Gas used by balanceOf(): 422
    ✔ checks balances and totalSupply on init == 0
info GAS Gas used by totalSupply(): 290
    ✔ should expect initial supply == 0
info GAS Gas used by mint(): 42394
info GAS Gas used by balanceOf(): 422
    ✔ should mint tokens to owner address
info GAS Gas used by totalSupply(): 290
    ✔ should have 16k as totalSupply (post mint)
info GAS Gas used by mint(): 27394
info GAS Gas used by balanceOf(): 422
info GAS Gas used by totalSupply(): 290
    ✔ deployer should mint tokens to address1
info GAS Gas used by transfer(): 27533
info GAS Gas used by balanceOf(): 422
info GAS Gas used by balanceOf(): 422
    ✔ should be able to transfer tokens
info GAS Gas used by getAllowance(): 547
    ✔ should check allowances and assert == 0
info GAS Gas used by approve(): 21993
info GAS Gas used by getAllowance(): 547
    ✔ should set allowance and check new values
```

### **Project Structure**

```
./annotated
    /uzicoin.huff -         - Huff contract written with a ton of rough notes, hence annotated
./test
    /util.js                - Contains helpers to initiate a VM, Huff runtime, orchestrating fn calls
    /simpletoken.spec.js    - Test suite for the erc20
config.js                   - contains a flag (shouldLogSteps), turning this to true logs OPCODES 
                              and stack on every interaction inside the VM
simpletoken.huff            - Clean version of ERC20 written in huff
```

### **ERC20 Spec**

A given ERC20 token has the following functions, all of which we will be implementing inside of a huff program (in the form of macros)
```
function totalSupply() public view returns (uint);
function balanceOf(address tokenOwner) public view returns (uint);
function allowance(address tokenOwner, address spender) public view returns (uint);
function transfer(address to, uint tokens) public returns (bool);
function approve(address spender, uint tokens) public returns (bool);
function transferFrom(address from, address to, uint tokens) public returns (bool);
function mint(address to, uint tokens) public returns (bool);
event Transfer(address indexed from, address indexed to, uint tokens);
event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
```

**Variables:**
- We need to identify storage locations and map them to a variable.
- To do this, we create macros that refer to storage locations that the ERC20
contract is interested in (e.g: balance location, owner address location)

**Solidity Mappings:**
- Smart contracts store data using `sstore`, using a pointer to a storage location.
- Each storage location can contain upto 32 bytes of data.
- Mappings are instrumented by combining the mapping key with storage slot of the mapping. This is then hashed, resulting in a 32 byte storage pointer unique to the key and variable in context.

**Calldata:**
- Data structure that stores input data sent as part of a contract call / transaction. Huff can load calldata using the `calldataload` opcode. Although, we do need to mention the offset in calldata to start loading from. => costs `6 gas` to load a word from calldata.
- We instead duplicate the entirety of calldata, since it costs only `3 gas`

**Events:**
- Events have two important attributes - `topics` and `data`. Topics are created when an indexed parameter exists (e.g: `Transfer(address indexed from, address indexed to, uint256 value)`)
- `keccack256` hash of an indexed element is used as the database lookup index (TODO: dig deeper)
- **Event signature:** is the `keccack256` hash of the event signature (e.g: `Transfer(address)`, `Approval(address, address, uint)`)
- We arrive at the conclusion that we need to put the data associated with `topics` onto the stack.


### **Credits**

The aztec team for the tutorials: [1](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-1-2-ba2b6de7fa83) [2](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-2-3-5438ef7e5beb) [3](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-3-4-6b347e23d66e) [4](https://medium.com/aztec-protocol/from-zero-to-nowhere-smart-contract-programming-in-huff-4-4-9e6c34648992)

Solidity workshop on storage [source](https://github.com/androlo/solidity-workshop/blob/master/tutorials/2016-03-13-advanced-solidity-IV.md)