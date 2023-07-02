import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Image from 'next/image';
import UserId from '../../components/userId';
import Head from 'next/head';
import Meta from '../../components/Meta';
import { ethers, Signer } from 'ethers';
import { SupercoolAuthContext } from '../../context/supercoolContext';
import axios from 'axios'; 
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

const Edit_user = () => {
	const superCoolContext = React.useContext(SupercoolAuthContext);
	const { handleImgUpload,UserProfileRef,db } = superCoolContext;
	const [coverePhoto, setCoverePhoto] = useState();
	const [username, setUsername] = useState("");
	const [walletAddress, setWalletAddress] = useState(undefined);
	const [bio, setBio] = useState("");
	const [profilePhoto, setProfilePhoto] = useState();

	
	const Profiledata = {
		username: username,
		bio: bio,
		profilephoto: profilePhoto,
		coverimage: coverePhoto,
		walletAddress: localStorage.getItem('address')
	}
	 
	const UsernameEvent = (e) => {
		setUsername(e.target.value)
	}
	const BioEvent = (e) => {
		setBio(e.target.value)
	}
	const handleCoverPhoto = async (event) => {
		let coverImg = await handleImgUpload(event.target.files[0]);
		setCoverePhoto(coverImg);
	}

	const handleProfilePhoto = async (event) => {
		let pfpImg = await handleImgUpload(event.target.files[0]);
		setProfilePhoto(pfpImg)
	}



	async function storeUserProfile() {
		console.log(Profiledata);
		const q = query(
			collection(db, "UserProfile"),
			where("walletAddress", "==", localStorage.getItem('address'))
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			addDoc(UserProfileRef, Profiledata);
			console.log("Profile stored!!");
		} else {
			querySnapshot.forEach((fire) => {
				const data = {
					username:
						Profiledata.username !== ""
							? Profiledata.username
							: fire.data().username,

					bio:
						Profiledata.bio !== ""
							? Profiledata.bio
							: fire.data().bio,

					profilephoto:
						Profiledata.profilephoto !== undefined
							? Profiledata.profilephoto
							: fire.data().profilephoto,

					coverimage:
						Profiledata.coverimage !== undefined
							? Profiledata.coverimage
							: fire.data().coverimage,

					walletAddress:
						Profiledata.walletAddress
				};
				const dataref = doc(db, "UserProfile", fire.id);
				updateDoc(dataref, data);
				console.log("Profile updated!!");

			})
		}

	}

	const updateProfile = async () => {
		await storeUserProfile()
	}

	useEffect(() => {
		const address = localStorage.getItem('address');
		if (address) {
			getEditProfileData();
		}
	}, [])

	const getEditProfileData = async () => {
		try {
			const q = query(
				collection(db, "UserProfile"),
				where("walletAddress", "==", localStorage.getItem('address'))
			);
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				console.log(" create profile!!");
			} else {
				const data = querySnapshot.docs.map((doc) => doc.data());
				setUsername(data[0].username)
				setBio(data[0].bio)
				setCoverePhoto(data[0].coverimage);
				setProfilePhoto(data[0].profilephoto)
			}
		} catch (error) {
			console.error("Error fetching user profile: ", error);
		}
	}

	return (
		<div>
			<Meta title="Profile || Xhibiter | NFT Marketplace Next.js Template" />
			<div className="pt-[5.5rem] lg:pt-24">
				{/* <!-- Banner --> */}
				<div className="relative">
					<img
						src={coverePhoto}
						alt="banner"
						className="h-[18.75rem] w-full object-cover"
					/>
					<div className="container relative -translate-y-4">
						<div className="font-display group hover:bg-accent absolute right-0 bottom-4 flex items-center rounded-lg bg-white py-2 px-4 text-sm">
							<input
								type="file"
								accept="image/*"
								className="absolute inset-0 cursor-pointer opacity-0"
								onChange={(e) => handleCoverPhoto(e)}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								className="fill-jacarta-400 mr-1 h-4 w-4 group-hover:fill-white"
							>
								<path fill="none" d="M0 0h24v24H0z"></path>
								<path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"></path>
							</svg>
							<span className="text-black mt-0.5 block group-hover:text-white">
								Edit cover photo
							</span>
						</div>
					</div>
				</div>
				{/* <!-- end banner --> */}
				{/* <!-- Edit Profile --> */}
				<section className="dark:bg-jacarta-800 relative py-16">
					<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
						<img src="/images/gradient_light.jpg" alt="gradient" className="h-full w-full" />
					</picture>
					<div className="container">
						<div className="mx-auto max-w-[48.125rem] md:flex">
							{/* <!-- Form --> */}
							<div className="mb-12 md:w-1/2 md:pr-8">
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Username<span className="text-red">*</span>
									</label>
									<input
										type="text"
										id="profile-username"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										placeholder="Enter username"
										required
										value={username}
										onChange={(e) => UsernameEvent(e)}
									/>
								</div>
								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Bio<span className="text-red">*</span>
									</label>
									<textarea
										id="profile-bio"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										required
										value={bio}
										placeholder="Tell the world your story!"
										onChange={(e) => BioEvent(e)}
									></textarea>
								</div>


								<div className="mb-6">
									<label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
										Wallet Address
									</label>
									<input
										type="text"
										id="profile-username"
										className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
										placeholder="wallet address"
										required
										value={localStorage.getItem('address')}
										disabled
									// onChange={UsernameEvent}
									/>
									{/* <UserId
										classes="js-copy-clipboard dark:bg-jacarta-700 border-jacarta-100 hover:bg-jacarta-50 dark:border-jacarta-600 dark:text-jacarta-300 flex w-full select-none items-center rounded-lg border bg-white py-3 px-4"
									userId={localStorage.getItem('address').slice(0, 34)}
									/> */}
								</div>
								<button className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
									onClick={updateProfile}
								>
									Update Profile
								</button>
							</div>
							{/* <!-- Avatar --> */}
							<div className="flex space-x-5 md:w-1/2 md:pl-8">
								<form className="shrink-0">
									<figure className="relative inline-block">
										<img
											// src={`$` }"https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80"
											src={profilePhoto}
											alt="collection avatar"
											className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
											height={140}
											width={140}
										/>
										<div className="group hover:bg-accent border-jacarta-100 absolute -right-3 -bottom-2 h-8 w-8 overflow-hidden rounded-full border bg-white text-center hover:border-transparent">
											<input
												type="file"
												accept="image/*"
												className="absolute top-0 left-0 w-full cursor-pointer opacity-0"
												onChange={(e) => handleProfilePhoto(e)}
											/>
											<div className="flex h-full items-center justify-center">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="fill-jacarta-400 h-4 w-4 group-hover:fill-white"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" />
												</svg>
											</div>
										</div>
									</figure>
								</form>
								<div className="mt-4">
									<span className="font-display text-jacarta-700 mb-3 block text-sm dark:text-white">
										Profile Image
									</span>
									<p className="dark:text-jacarta-300 text-sm leading-normal">
										We recommend an image of at least 300x300. Gifs work too. Max 5mb.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- end edit profile --> */}
			</div>
		</div>
	);
};

export default Edit_user;
