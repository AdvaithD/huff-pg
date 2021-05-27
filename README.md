### Huff playground

#### Introduction

Huff was created while writing a zk proof library (weierstrudel). At the time, this was something that could not be done in solidity.

Huff is about as close as you can get to the EVM in terms of assembly code.

- Most huff programs are macros, which can contain more macros or evm opcodes.
- When a macro is invoked, template params are supplied to the macro.
- Huff doesn't have functions or variables
- Ultimately, if your goal is to write gas-efficient contracts, huff is the way to go (imo).