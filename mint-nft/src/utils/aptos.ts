import { WalletClient } from "@martiandao/aptos-web3-bip44.js";
import { APTOS_FAUCET_URL, APTOS_NODE_URL } from "../config/constants";
import nacl from "tweetnacl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_U64_BIG_INT: bigint = BigInt(2 ** 64) - BigInt(1);

export function createCollectionPayload(
  name: string,
  description: string,
  uri: string,
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_collection_script",
    type_arguments: [],
    arguments: [
      name,
      description,
      uri,
      MAX_U64_BIG_INT.toString(),
      [false, false, false],
    ],
  };
}

export function createTokenPayload(
  collection: string,
  name: string,
  description: string,
  uri: string,
  royaltyPayee: string,
) {
  return {
    type: "entry_function_payload",
    function: "0x3::token::create_token_script",
    type_arguments: [],
    arguments: [
      collection,
      name,
      description,
      "1",
      MAX_U64_BIG_INT.toString(),
      uri,
      royaltyPayee,
      "100",
      "0",
      [false, false, false, false, false],
      [],
      [],
      [],
    ],
  };
}

export const walletClient = new WalletClient(APTOS_NODE_URL, APTOS_FAUCET_URL);


// Data type for petra wallet connect
export type ConnectData = {
  appInfo: {
    domain: string;
  };
  redirectLink: string;
  dappEncryptionPublicKey?: string;
  payload?: any;
};

// Supported wallet types
type Wallet = "pontem" | "rise" | "petra";


/**
 * Retrieves the Dapp public key from AsyncStorage.
 * If the public key and secret key are already stored, it returns the public key as a hexadecimal string.
 * If the keys are not stored, it generates a new key pair, stores them in AsyncStorage, and returns the public key as a hexadecimal string.
 * @returns The Dapp public key as a hexadecimal string.
 */
export const getDappPublicKey = async () => {
  const storedPublicKey = await AsyncStorage.getItem("petra_publicKey");
  const storedSecretKey = await AsyncStorage.getItem("petra_secretKey");

  if (storedPublicKey && storedSecretKey) {
    const publicKeyArray = new Uint8Array(
      Buffer.from(storedPublicKey, "base64")
    );

    const secretKeyArray = new Uint8Array(
      Buffer.from(storedSecretKey, "base64")
    );

    const Keys = {
      publicKey: publicKeyArray,
      secretKey: secretKeyArray,
    };
    const publicKeyString = Buffer.from(Keys.publicKey).toString("hex");

    return { publicKeyString, Keys };
  } else {
    const keyPair = nacl.box.keyPair();

    const publicKeyBase64 = Buffer.from(keyPair.publicKey).toString("base64");
    const secretKeyBase64 = Buffer.from(keyPair.secretKey).toString("base64");

    await AsyncStorage.setItem("petra_publicKey", publicKeyBase64);
    await AsyncStorage.setItem("petra_secretKey", secretKeyBase64);

    const Keys = {
      publicKey: keyPair.publicKey,
      secretKey: keyPair.secretKey,
    };
    const publicKeyString = Buffer.from(keyPair.publicKey).toString("hex");
    return { publicKeyString, Keys };
  }
};
// export const handlWalletConnect = async (walletName: Wallet) => {
//   // redirect link for the wallet connect
//   //const redirect_link = Linking.createURL(`/ChooseWallet`);

//   if (walletName === "petra") {
//     let connectData: ConnectData = {
//       appInfo: {
//         domain: "com.townesquare.townesquare",
//       },
//       redirectLink: "",
//     };

//     let base64ConnectData: string;

//     // Get Dapp Public key
//     const { publicKeyString, Keys } = await getDappPublicKey();
//     connectData.dappEncryptionPublicKey = publicKeyString;
//     console.log(Keys);
//     // Convert the connect data to base64
//     base64ConnectData = Buffer.from(JSON.stringify(connectData)).toString(
//       "base64"
//     );

//     const url = `https://petra.app/api/v1/connect?data=${base64ConnectData}`;

//     // Open the wallet connect link
//     await Linking.openURL(url);
//   } else if (walletName === "pontem") {
//     //TODO: Add pontem wallet connect
//     const appInfo = {
//       name: "Townesquare",
//       logoUrl:
//         "https://www.townesquare.xyz/static/media/logo.6e77e4b3cad4fe08bb6e.png",
//       redirectLink: redirect_link,
//     };
//     const base64ConnectData = Buffer.from(JSON.stringify(appInfo)).toString(
//       "base64"
//     );

//     const url = `pontem-wallet://mob2mob?connect=${base64ConnectData}`;

//     // Open the wallet connect link
//     Linking.openURL(url);
//   }
// };