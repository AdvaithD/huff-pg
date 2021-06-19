const chai = require('chai')
const {expect} = chai
const BigNumber = require('bn.js')
const crypto = require('crypto')
// const tokenRuntime = require('./util')
const {balanceOf, approve, transfer, transferFrom, getAllowance, totalSupply, initialize, mint} = require('./util')

describe('Simpletoken - ERC20 in Huff', () => {
    const owner = new BigNumber(crypto.randomBytes(20), 16);
    const user1 = new BigNumber(crypto.randomBytes(20), 16);
    const user2 = new BigNumber(crypto.randomBytes(20), 16);
    const user3 = new BigNumber(crypto.randomBytes(20), 16);
    const user4 = new BigNumber(crypto.randomBytes(20), 16)

    before(async () => {
        await initialize(owner)
    })

    it('checks balances and totalSupply on init == 0', async () => {
        const balance1 = await balanceOf(owner);
        expect(balance1.eq(new BN(0))).to.equal(true);
        const balance2 = await balanceOf(user1);
        expect(balance2.eq(new BN(0))).to.equal(true);
        const totalSupply = await totalSupply();
        expect(totalSupply.eq(new BN(0))).to.equal(true);
    })
})