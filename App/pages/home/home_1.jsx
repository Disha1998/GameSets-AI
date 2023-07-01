import React from "react";
import {
  Hero,
  Bids,
  Top_collection,
  Tranding_category,
  NewseLatter,
} from "../../components/component";
import Meta from "../../components/Meta";

const Home_1 = () => {
  // console.log('----',process.env.NEXT_PUBLIC_APP_INFURA_PROJECT_KEY, process.env.NEXT_PUBLIC_APP_INFURA_APP_SECRET_KEY);

  return (
    <main>
      <Meta title="Home" />
      <Hero />
      <Bids />
      <Tranding_category />
    </main>
  );
};

export default Home_1;
