import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import Auctions_dropdown from '../../components/dropdown/Auctions_dropdown';
import Link from 'next/link';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Items_Countdown_timer from '../../components/items_countdown_timer';
import { ItemsTabs } from '../../components/component';
import More_items from './more_items';
import Likes from '../../components/likes';
import Meta from '../../components/Meta';
import { useDispatch } from 'react-redux';
import { bidsModalShow } from '../../redux/counterSlice';
import { SupercoolAuthContext } from '../../context/supercoolContext';
import { ethers } from 'ethers';
const Item = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const pid = router.query.item;
	const [imageModal, setImageModal] = useState(false);
	const [currentPriceUSD, setCurrentPriceUSD] = useState();
	const [maticToUSD, setMaticToUSD] = useState();
	const superCoolContext = React.useContext(SupercoolAuthContext);
	const { allNfts } = superCoolContext;


	return (
		<>
			<Meta title={`${pid} || Xhibiter | NFT Marketplace Next.js Template`} />
			{/*  <!-- Item --> */}
			<section className="relative lg:mt-24 lg:pt-24 lg:pb-24 mt-24 pt-12 pb-24">
				<picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
					<img src="/images/gradient_light.jpg" alt="gradient" className="h-full" />
				</picture>
				<div className="container">
					{/* <!-- Item --> */}
					{allNfts
						.filter((item) => item.tokenId == pid)
						.map((item) => {
							return (
								<div key={item.tokenId} className="md:flex md:flex-wrap" >
									{/* <!-- Image --> */}
									<figure className="mb-8 md:w-2/5 md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full">
										<button className=" w-full" onClick={() => setImageModal(true)}>
											<img src={item.image} alt={item.title} className="rounded-2xl cursor-pointer  w-full" />
										</button>

										{/* <!-- Modal --> */}
										<div className={imageModal ? 'modal fade show block' : 'modal fade'}>


											<button
												type="button"
												className="btn-close absolute top-6 right-6"
												onClick={() => setImageModal(false)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													className="h-6 w-6 fill-white"
												>
													<path fill="none" d="M0 0h24v24H0z" />
													<path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
												</svg>
											</button>
										</div>
										{/* <!-- end modal --> */}
									</figure>

									{/* <!-- Details --> */}
									<div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
										{/* <!-- Collection / Likes / Actions --> */}
										<div className="mb-3 flex">
											{/* <!-- Collection --> */}
											<div className="flex items-center">
												<Link href="#">
													<a className="text-accent mr-2 text-sm font-bold">{item.owner}</a>
												</Link>
												<span
													className="dark:border-jacarta-600 bg-green inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
													data-tippy-content="Verified Collection"
												>
													<Tippy content={<span>Verified Collection</span>}>
														<svg className="icon h-[.875rem] w-[.875rem] fill-white">
															<use xlinkHref="/icons.svg#icon-right-sign"></use>
														</svg>
													</Tippy>
												</span>
											</div>

										</div>

										<h1
											className="font-display text-jacarta-700 mb-4 text-4xl font-semibold dark:text-white">
											{item.title}
										</h1>

										<div className="mb-8 flex items-center space-x-4 whitespace-nowrap">
											<div className="flex items-center">
												<Tippy content={<span>FTM</span>}>
													<span className="-ml-1">
														<img
															className='icon mr-1 h-4 w-4'
															src='/images/fantom.png'
														/>
														{/* <svg className="icon mr-1 h-4 w-4">
															<use xlinkHref="/icons.svg#icon-ETH"></use>
														</svg> */}
													</span>
												</Tippy>
												<span className="text-green text-sm font-medium tracking-tight">
													{item.price} FTM
												</span>
											</div>
											<span className="dark:text-jacarta-300 text-jacarta-400 text-sm">
												1/1 available
											</span>
										</div>

										{/* Description--- */}
										<p className="dark:text-jacarta-300 mb-10">{item.description}</p>

										{/* <!-- Creator / Owner --> */}
										<div className="mb-8 flex flex-wrap">
											<div className="mb-4 flex">
												<figure className="mr-4 shrink-0">
													<Link href="/user/avatar_6">
														<a className="relative block">
															<img
																src={item.image}
																alt={item.title}
																className="rounded-2lg h-12 w-12"
																loading="lazy"
															/>
															<div
																className="dark:border-jacarta-600 bg-green absolute -right-3 top-[60%] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
																data-tippy-content="Verified Collection"
															>
																<Tippy content={<span>Verified Collection</span>}>
																	<svg className="icon h-[.875rem] w-[.875rem] fill-white">
																		<use xlinkHref="/icons.svg#icon-right-sign"></use>
																	</svg>
																</Tippy>
															</div>
														</a>
													</Link>
												</figure>
												<div className="flex flex-col justify-center">
													<span className="text-jacarta-400 block text-sm dark:text-white">
														Owned by
													</span>
													<Link href="/user/avatar_6">
														<a className="text-accent block">
															<span className="text-sm font-bold">{item.owner.slice(0, 11)}</span>
														</a>
													</Link>
												</div>
											</div>
										</div>

										{/* <!-- Bid --> */}
										<div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8">

											<button
												className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
												onClick={() => dispatch(bidsModalShow())}
											>
												Purchase NFT
											</button>
										</div>
										{/* <!-- end bid --> */}
									</div>
									{/* <!-- end details --> */}
								</div>
							);
						})}
					{/* <ItemsTabs /> */}
				</div>
			</section>
			{/* <!-- end item --> */}

			<More_items />
		</>
	);
};

export default Item;
