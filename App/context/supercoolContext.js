import React, { useState, createContext, useEffect, useRef } from "react";
import { BigNumber, providers } from 'ethers';
import { SUPER_COOL_NFT_CONTRACT, abi } from "../constant/constant";
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { RandomPrompts } from "../components/RandomImgs";
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

import { getDatabase, ref, set } from "firebase/database";
export const SupercoolAuthContext = createContext(undefined);

export const SupercoolAuthContextProvider = (props) => {

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allNfts, setAllNfts] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [userAdd, setUserAdd] = useState();
  const [genRanImgLoding, setGenRanImgLoding] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);


  // console.log('all nfts',allNfts);
  useEffect(() => {
    getSignerFromProvider();
  }, [])

  const firebaseConfig = {
    apiKey: "AIzaSyC8RT5Jn9XAsog-FWi3ny2VQEajDoLPv7U",
    authDomain: "gamesets-fantom.firebaseapp.com",
    projectId: "gamesets-fantom",
    storageBucket: "gamesets-fantom.appspot.com",
    messagingSenderId: "82497989740",
    appId: "1:82497989740:web:cf30a3f6580b0f834a3c49"
  };
  

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const firestore = getFirestore();
  const collectionRef = collection(firestore, "TokenUri");
  const UserProfileRef = collection(firestore, "UserProfile");

  // const totalNfts = async () => {
  //   const contractPro = new ethers.Contract(
  //     SUPER_COOL_NFT_CONTRACT,
  //     abi,
  //     provider
  //   );
  //   const numOfNfts = await contractPro.getTotalSupply();
  //   console.log('total supp--',Number(numOfNfts));
  //   return Number(numOfNfts) + 1;
  // }
  // totalNfts()

  async function storeDataInFirebase(metadata) {
    const docRef = await addDoc(collectionRef, metadata);
    console.log("Data stored successfully! Document ID:", docRef.id);
  }

  const updateForPurchase = async (tokenId) => {
    console.log('tok id',tokenId);
    const q = query(
      collection(db, "TokenUri"),
      where("tokenId", "==", tokenId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((fire) => {
      const data = {
        owner: localStorage.getItem('address'),
      };
      const dataref = doc(db, "TokenUri", fire.id);
      updateDoc(dataref, data);
      console.log('updated buyer!!');
    })
  }

  async function getSignerFromProvider() {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
    } else {
      console.log('No wallet connected or logged out');
    }
  }


  const login = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAdd(accounts[0]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('address', accounts[0]);
      }

      if (window.ethereum.networkVersion === '80001') {
        setWalletConnected(true);
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xfa2' }] // Polygon Mumbai chain ID
        });
        setWalletConnected(true);
      }

      if (ethereum && ethereum.selectedAddress) {
        const address = await signer.getAddress();

      } else {
        console.log('No wallet connected or logged out');
      }
      getAllNfts();
    } catch (error) {
      console.error('Login error:', error);
    }
    getAllNfts();
  }

  const logout = async () => {
    localStorage.removeItem('address');
    setWalletConnected(false);
  }

  const auth =
    "Basic " +
    Buffer.from(
      process.env.infuraProjectKey + ":" + process.env.infuraSecretKey
    ).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });


  const GenerateNum = () => {
    const index = Math.floor(Math.random() * RandomPrompts.length);
    setPrompt(RandomPrompts[index])
  };

  
  async function getAllNfts() {
    try {
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.log("Fetched data:", data);
      let allnfts = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        allnfts.push(item);
        setAllNfts(allnfts);
      }
      console.log('all nfts--',allnfts);
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  }

  useState(() => {
    setTimeout(() => {
      // console.log('running usestate');
      getAllNfts()
    }, 5000);
  }, [loading])

  const FTMToUsdPricee = async (_price) => {
    const contractPro = new ethers.Contract(
      SUPER_COOL_NFT_CONTRACT,
      abi,
      provider
    );
    return await contractPro.convertFTMUsd(ethers.utils.parseUnits(_price, 'ether'));
  }
  const uploadOnIpfs = async (e) => {
    let dataStringify = JSON.stringify(e);
    const ipfsResult = await client.add(dataStringify);
    const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;

    return contentUri;
  }

  const handleImgUpload = async (file) => {
    const added = await client.add(file);
    const hash = added.path;
    const ipfsURL = `https://superfun.infura-ipfs.io/ipfs/${hash}`;
    return ipfsURL;
  };

  // Edit profile

  const uploadDatainIpfs = async (e) => {
    let dataStringify = JSON.stringify(e);
    const ipfsResult = await client.add(dataStringify);
    const contentUri = `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
    // console.log('contentUri', contentUri);
    return contentUri;
  }

  const generateText = async (detailPrompt) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: detailPrompt,
          max_tokens: 700,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.choices[0].text);
      setPrompt(response.data.choices[0].text);
      // return response.data.choices[0].text;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SupercoolAuthContext.Provider
      value={{
        login,
        logout,
        uploadOnIpfs,
        allNfts,
        handleImgUpload,
        client,
        loading,
        setLoading,
        GenerateNum,
        prompt,
        setPrompt,
        genRanImgLoding,
        userAdd,
        uploadDatainIpfs,
        getAllNfts,
        generateText,
        storeDataInFirebase,
        FTMToUsdPricee,
        provider,
        updateForPurchase,
        UserProfileRef,
        db
      }}
      {...props}
    >
      {props.children}
    </SupercoolAuthContext.Provider>
  );
};
