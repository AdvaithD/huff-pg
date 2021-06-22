const chai = require('chai')
const {expect} = chai
const BigNumber = require('bn.js')
const crypto = require('crypto')
const {balanceOf, approve, transfer, transferFrom, getAllowance, totalSupply, initialize, mint} = require('./util')

describe('Simpletoken - ERC20 in Huff', () => {
    const owner = new BigNumber(crypto.randomBytes(20), 16);
    const secondaryUser = new BigNumber(crypto.randomBytes(20), 16);
    const user2 = new BigNumber(crypto.randomBytes(20), 16);
    const user3 = new BigNumber(crypto.randomBytes(20), 16);
    const user4 = new BigNumber(crypto.randomBytes(20), 16)
    
    // mint values
    const initMint = new BigNumber(16000)
    const secondMint = new BigNumber(24000)

    before(async () => {
        // initialize the erc20 runtime using @aztec/huff library
        await initialize(owner)
    })

    it('checks balances and totalSupply on init == 0', async () => {
        const balance1 = await balanceOf(owner);
        expect(balance1.eq(new BigNumber(0))).to.equal(true);
        const balance2 = await balanceOf(secondaryUser);
        expect(balance2.eq(new BigNumber(0))).to.equal(true);
    })

    it('should expect initial supply == 0', async () => {
        const supply = await totalSupply();
        expect(supply.eq(new BigNumber(0))).to.equal(true);
    })

    it('should mint tokens to owner address', async () => {
        await mint(owner, owner, initMint)
        const deployerBalance = await balanceOf(owner);
        
        expect(deployerBalance.toString()).to.equal('16000')
    })

    it('should have 16k as totalSupply (post mint)', async () => {
        const supply = await totalSupply()
        expect(supply.toString()).to.equal('16000')
    })

    it('deployer should mint tokens to address1', async () => {
        await mint(owner, secondaryUser, secondMint)
        const secondaryUserBalance = await balanceOf(secondaryUser)
        expect(secondaryUserBalance.toString()).to.equal('24000')

        const supplyAfter = await totalSupply()
        expect(supplyAfter.toString()).to.equal('40000')
    })

    it('should be able to transfer tokens', async () => {
        await transfer(owner, user2, new BigNumber(1000)) // transfer 1k tokens

        const balanceOfOwner = await balanceOf(owner)
        const balanceOfNewUser = await balanceOf(user2)

        expect(balanceOfOwner.toString()).to.equal('15000')  // owner balance: 16k -> 15k
        expect(balanceOfNewUser.toString()).to.equal('1000') // new user balance: 0 -> 1k
    })

    it('should check allowances and assert == 0', async () => {
        const allowanceOne = await getAllowance(owner, user2)
        expect(allowanceOne.toString()).to.equal('0') // allowance from owner -> user2
    })

    it('should set allowance and check new values', async () => {
        // owner -> user new allowance of 1500 tokens
        await approve(owner, user2, new BigNumber(1500)) 
        const newAllowance = await getAllowance(owner, user2)

        expect(newAllowance.toString()).to.equal('1500')
    })

    // it('[transferFrom] should transfer from', async () => {
    //     await transferFrom(owner, owner, user3, new BigNumber(500))

    //     const balanceOfOwner = await balanceOf(owner)
    //     const balanceOfThree = await balanceOf(user3)

    //     console.log(balanceOfOwner.toString(), balanceOfThree.toString())

    // })
})