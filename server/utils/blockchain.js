require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("./contractAbi");

function getBlockchainObjects() {
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_URL,
    Number(process.env.CHAIN_ID),
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    wallet,
  );

  return { provider, wallet, contract };
}

async function storeHashOnChain(businessId, hashHex) {
  const { contract } = getBlockchainObjects();

  const hashBytes32 = "0x" + hashHex.replace(/^0x/, "");

  const tx = await contract.storeHash(businessId, hashBytes32);
  const receipt = await tx.wait();

  let recordId = null;
  if (receipt.logs && receipt.logs.length > 0) {
    try {
      for (const log of receipt.logs) {
        const parsed = contract.interface.parseLog(log);
        if (parsed && parsed.name === "HashStored") {
          recordId = Number(parsed.args.recordId);
          break;
        }
      }
    } catch (e) {}
  }

  return {
    txHash: receipt.hash,
    recordId,
  };
}

async function getRecordFromChain(recordId) {
  const { contract } = getBlockchainObjects();
  const record = await contract.getRecord(recordId);
  return record;
}

module.exports = {
  storeHashOnChain,
  getRecordFromChain,
};
