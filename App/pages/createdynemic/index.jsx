import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import { Configuration, OpenAIApi } from "openai";
import { SUPER_COOL_NFT_CONTRACT, abi } from "../../constant/constant";
import { ethers } from "ethers";
import { SupercoolAuthContext } from "../../context/supercoolContext";
import { NFTStorage, File } from 'nft.storage'
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import DynamicImageModal from "../modal/dynamicmodal";
import RenderDynamicsellNft from "../renderSellNft/renderDynamicSellNft";


export default function CreateDynemic() {
  const superCoolContext = React.useContext(SupercoolAuthContext);
  const { uploadOnIpfs, loading, setLoading, prompt, setPrompt, getAllNfts } = superCoolContext;

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Profile avatar" || category);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [chain, setChain] = useState("Fantom" || chain);
  const [rendersellNFT, setrendersellNFT] = useState(false)
  const [rendersellNFTAgain, setrendersellNFTAgain] = useState(true)
  const [modalOpen, setModalOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Create a dynamic NFT that visually transforms to represent real-time weather conditions..."
  );
  const [images, setImages] = React.useState([]);
  const [dynamicMetadataArr, setDynemicMetadataArr] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);


  const configuration = new Configuration({
    apiKey: process.env.apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlkNTYwMUJiOWNFOTkyQjZkYjU4OWYzMGY1NDZGMmYxODJhM0RCOTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzM0NzIzNzMwNSwibmFtZSI6InRydXN0aWZpZWQtZnZtIn0.YDlyBmcRUT0lb2HmMzT0tS1AUY8pGNp1NHqN4xr8_fk";

  // const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });


  const generateImage = async () => {
    setGenerateLoading(true);
    setPlaceholder(`Search ${prompt}...`);
    try {
      const res = await openai.createImage({
        prompt: prompt,
        n: 3,
        size: "256x256",
      });
      // console.log(res);

      let arry = [];
      for (let i = 0; i < res.data.data.length; i++) {
        const img_url = res.data.data[i].url;
        console.log('img_url', img_url);
        const api = await axios.create({
          baseURL:
            "https://open-ai-enwn.onrender.com",
        });
        const obj = {
          url: img_url
        }
        let response = await api
          .post("/image", obj)
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
          });
        const arr = new Uint8Array(response.data.data);
        const blob = new Blob([arr], { type: 'image/jpeg' });
        const imageFile = new File(
          [blob],
          `data.png`,
          {
            type: "image/jpeg",
          }
        );
        const metadata = await client.store({
          name: "data",
          description: "data",
          image: imageFile
        });
        const imUrl = `https://ipfs.io/ipfs/${metadata.ipnft}/metadata.json`;

        // console.log(imUrl, "imUrl");
        const data = (await axios.get(imUrl)).data;
        // console.log(data.image, "data");
        const rep = data.image.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );
        // console.log(rep, '==rep');

        arry.push(rep);
      }
      // console.log(arry, '----arry');
      setImages(arry);
      setGenerateLoading(false);

    } catch (error) {
      console.error(`Error generating image: ${error}`);
      setGenerateLoading(false);
    }
  };

  const StoreDyanamicNftsMetadata = async () => {
    const nftData = {
      title: title,
      description: description,
      price: price,
      city: city,
      chain: chain,
      image: selectedImage,
      category: category
    }
    console.log(nftData);
    let metadataurl = await uploadOnIpfs(nftData);
    dynamicMetadataArr.push(metadataurl);
    setrendersellNFTAgain(false);
  }
  console.log('dynamic meta data urls--', dynamicMetadataArr);

  const createDynamicNft = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      SUPER_COOL_NFT_CONTRACT,
      abi,
      signer
    );
    try {
      const tx = await contract.mintDynamicNFT(city, dynamicMetadataArr ,ethers.utils.parseUnits(price?.toString(), "ether"));
     const receipt = await tx.wait();
     console.log('receipt of dynamic mint',receipt);
    } catch (e) {
      console.error("Failed to mint NFT: " + e.message);
    }
  }

  function handleSelectedImg(url) {
    setrendersellNFT(false);
    setSelectedImage(url);
    setModalOpen(true);
  }

  return (
    <>
      <div className="container">
        <Meta title="SuperCool" />

        <section className="relative py-24 nft-sections fixed">
          <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
            <img
              src="/images/gradient_light.jpg"
              alt="gradient"
              className="h-full w-full"
            />
          </picture>

          <div className="container nft-sections">
            <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
              Let your creativity shine and give us a clear picture with your words
            </h1>

            <div className="mx-auto max-w-[48.125rem]">

              <div className="mb-6">
                <p className="dark:text-jacarta-300 text-4xs mb-3">
                  We're excited to bring your NFT to life, but we need your input. Please provide us with a brief description of what you want it to look like.
                </p>

                <textarea
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={placeholder}
                  value={prompt}
                  id="item-description"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  rows="6"
                  required
                >
                </textarea>

                <div className="generate-btn">
                  {generateLoading ?
                    <CircularProgress />
                    :
                    <button
                      className="bg-accent-lighter rounded-full py-3 px-8 text-center font-semibold text-white transition-all  "
                      style={{ marginBottom: "15px" }}
                      onClick={generateImage}
                    >
                      Generate
                    </button>
                  }
                </div>
                <br />

                {
                  images.length > 0 ?
                    <>
                      <div className="row main-row">
                        {console.log(images, '===images')}
                        {images && images.map((url) => (

                          <div
                            className="col-lg-4 mb-4 mb-lg-0"
                            onClick={() => handleSelectedImg(url)}
                          >
                            <div
                              className="bg-image hover-overlay ripple shadow-1-strong rounded col-4"
                              data-ripple-color="light"
                            >
                              <div className="img-nft">
                                <img
                                  src={url}
                                  alt='nft-images'
                                />
                              </div>
                              <div className="radio-img">
                                <input
                                  type="radio"
                                  id="huey"
                                  name="drone"
                                  value="huey"
                                  checked={url == selectedImage}
                                  className="mt-3"
                                />
                              </div>
                            </div>
                          </div>

                        ))}

                      </div>
                      <div>
                        <p style={{ textAlign: "center" }} className="dark:text-jacarta-300 text-4xs mb-3"
                        >Select the image you wish to mint.</p>
                      </div>

                      { dynamicMetadataArr.length === 3 ?
                        <button
                      className="bg-accent-lighter rounded-full py-3 px-8 text-center font-semibold text-white transition-all  "
                      style={{ marginBottom: "15px" }}
                      onClick={createDynamicNft}
                    >
                      create Dynamic NFT
                    </button> : ""
                    }

                    </>
                    : ""
                }

              </div>

              {modalOpen &&
                <div className="dynamic-img-overlay">
                  <DynamicImageModal
                  StoreDyanamicNftsMetadata={StoreDyanamicNftsMetadata}
                    rendersellNFTAgain={rendersellNFTAgain}
                    setrendersellNFTAgain={setrendersellNFTAgain}
                    setModalOpen={setModalOpen}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    setrendersellNFT={setrendersellNFT}
                  />
                </div>
              }

            </div>
            <RenderDynamicsellNft
            StoreDyanamicNftsMetadata={StoreDyanamicNftsMetadata}
              rendersellNFT={rendersellNFT}
              rendersellNFTAgain={rendersellNFTAgain}
              setrendersellNFTAgain={setrendersellNFTAgain}
              setTitle={setTitle}
              setDescription={setDescription}
              city={city}
              setCity={setCity}
              setPrice={setPrice}
              mintLoading={mintLoading}
              category={category}
              setCategory={setCategory}
              chain={chain}
              setChain={setChain}
            />
          </div >
        </section >
        {/* </div> */}
      </div>
      {/* </div> */}
    </>
  )
}
