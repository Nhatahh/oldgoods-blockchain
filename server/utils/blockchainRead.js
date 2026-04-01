require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("./contractAbi");

function getReadContract() {
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL,
    Number(process.env.CHAIN_ID || 567),
  );

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    provider,
  );

  return { provider, contract };
}

async function getTradeFromChain(businessId) {
  const { contract } = getReadContract();
  return await contract.getTrade(businessId);
}

module.exports = {
  getTradeFromChain,
};
