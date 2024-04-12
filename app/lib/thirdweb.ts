import { createThirdwebClient, defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { encode, getContract } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc721";
import { FrameValidationData } from "@coinbase/onchainkit";

const secretKey = process.env.TW_SECRET_KEY;
export const CLIENT = createThirdwebClient({
  secretKey: secretKey as string,
});
export const CHAIN = defineChain(baseSepolia);

export const erc721ContractAddress = process.env.CONTRACT_ADDRESS as string;

export const getERC721PreparedEncodedData = async (walletAddress: string) => {
  // Get the contract
  const contract = getContract({
    client: CLIENT,
    chain: CHAIN,
    address: erc721ContractAddress,
  });

  const tx = claimTo({
    contract: contract,
    to: walletAddress,
    quantity: BigInt(1),
  });

  const encodedData = encode(tx);

  // Return the encoded transaction data
  return encodedData;
};

export const getFarcasterAccountAddress = (
  interactor: FrameValidationData["interactor"],
) => {
  // Get the first verified account or the custody address
  return interactor.verified_accounts[0] ?? interactor.custody_address;
};
