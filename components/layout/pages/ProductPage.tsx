import React from "react";
import RelatedItems from "../product/RelatedItems";
import ProductsGroup from "../product/ProductsGroup";
import Product from "../product/Product";

const productsGroup = [
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
];

const relatedItems = [
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  },
  {
    imageUrl: "./images/catalog-img-4.svg",
    setName: "Set Name",
    itemCount: 1,
    itemNames: "",
    currentPrice: 2500,
    originalPrice: 3200,
  }
];

const ProductPage: React.FC = () => {

  return (
    <section className="box-border flex relative flex-col grow shrink-0 self-stretch mx-auto w-full max-w-[1240px]">
      <Product />
      <ProductsGroup 
        title="These items are cheaper together" 
        productsGroup={productsGroup} 
      />
      <RelatedItems 
        title="Features" 
        relatedItems={relatedItems} 
      />
    </section>
  );
};

export default ProductPage;
