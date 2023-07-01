import React, { useState, createContext, useEffect, useRef } from "react";
import { BigNumber, providers } from 'ethers';
import { SUPER_COOL_NFT_CONTRACT, abi } from "../constant/constant";
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { RandomPrompts } from "../components/RandomImgs";
import localforage from 'localforage'
import axios from 'axios';

export const SupercoolAuthContext = createContext(undefined);

export const SupercoolAuthContextProvider = (props) => {

  const web3ModalRef = useRef();
  // let defPrompt = "I want you to act as a prompt engineer. You will help me write prompts for an ai art generator called Midjourney. I will provide you with short content ideas and your job is to elaborate these into full, explicit, coherent prompts. Prompts involve describing the content and style of images in concise accurate language. It is useful to be explicit and use references to popular culture, artists and mediums. Your focus needs to be on nouns and adjectives. I will give you some example prompts for your reference. Please define the exact camera that should be used Here is a formula for you to use(content insert nouns here)(medium: insert artistic medium here)(style: insert references to genres, artists and popular culture here)(lighting, reference the lighting here)(colours reference color styles and palettes here)(composition: reference cameras, specific lenses, shot types and positional elements here) when giving a prompt remove the brackets, speak in natural language and be more specific, use precise, articulate language. Example prompt: Portrait of a Celtic Jedi Sentinel with wet Shamrock Armor, green lightsaber, by Aleksi Briclot, shiny wet dramatic lighting. For now if understand what I asked to you just replay 'write anything'. And write full prompt from next request. "


  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allNfts, setAllNfts] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [userAdd, setUserAdd] = useState();
  const [genRanImgLoding, setGenRanImgLoding] = useState(false);
  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);

  let provider;
  let signer;
  if (typeof window !== "undefined" && window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log('No wallet connected or logged out');
  }


  const login = async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAdd(accounts[0]);
      localforage.setItem('address', accounts[0]);
      if (window.ethereum.networkVersion === '80001') {
        setWalletConnected(true);
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }] // Polygon Mumbai chain ID
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
    localforage.removeItem('address');
    setWalletConnected(false);
    localforage.getItem('address').then((value) => {
      console.log(value)
    })
  }
  console.log(userAdd)

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

  const contract = new ethers.Contract(
    SUPER_COOL_NFT_CONTRACT,
    abi,
    signer
  );

  const GenerateNum = async () => {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    // console.log(accounts);
    setGenRanImgLoding(true);
    const tx = await contract.getRandomNumber();
    await tx.wait();
    const num = await contract.ranNum();
    setPrompt(RandomPrompts[num]);
    setGenRanImgLoding(false);
  }
  // console.log(process.env.apiKey);
  const getProfileData = async (add) => {
    console.log('use add--', add);
    if (add !== undefined) {
      const dataurl = await contract.getUserProfile(add);
      console.log(dataurl);
      const response = await axios.get(dataurl);
      // console.log(response.data);
      return response;
    }
  }
  const contractPro = new ethers.Contract(
    SUPER_COOL_NFT_CONTRACT,
    abi,
    provider
  );
  const getAllNfts = async () => {

    console.log('getting all nfts ...');
    const totalNfts = await contractPro.getTotalSupply();
    const metadatas = [];
    for (let i = 1; i <= totalNfts.toString(); i++) {
      const tokenURI = await contractPro.tokenURI(i);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      const owner = await contractPro.ownerOf(i);
      const maticToUsdPricee = await contractPro.convertMaticUsd(ethers.utils.parseUnits(metadata.price, 'ether'));

      const newMetadata = { ...metadata, owner: owner, tokenId: i, maticToUSD: maticToUsdPricee._hex / 100000000 }

      metadatas.push(newMetadata);
    }
    setAllNfts(metadatas);
    setLoading(!loading);
  }

  useState(() => {
    setTimeout(() => {
      console.log('running usestate');
      getAllNfts();
    }, 5000);
  }, [loading])
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
    console.log('contentUri', contentUri);
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
        contract,
        GenerateNum,
        prompt,
        setPrompt,
        genRanImgLoding,
        userAdd,
        uploadDatainIpfs,
        getAllNfts,
        getProfileData,
        generateText
      }}
      {...props}
    >
      {props.children}
    </SupercoolAuthContext.Provider>
  );
};
