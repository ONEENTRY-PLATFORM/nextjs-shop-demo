import React from "react";
import ProductImage from "../product/ProductImage";
import ProductDescription from "../product/ProductDescription";
import ProductDetails from "../product/ProductDetails";
import RelatedItems from "../product/RelatedItems";
import ProductsGroup from "../product/ProductsGroup";

interface ProductPageProps {
  productName: string;
  productType: string;
  price: number;
  stock: number;
  description: string;
  imageSrc: string;
}

const ProductPage: React.FC<ProductPageProps> = ({
  productName,
  productType,
  price,
  stock,
  description = "Text description",
  imageSrc,
}) => {
  return (
    <section className="box-border flex relative flex-col grow shrink-0 self-stretch mx-auto w-full max-w-[1240px]">
      <div className="flex flex-row gap-10 mb-16 max-md:max-w-full max-md:flex-wrap">
        <ProductImage imageSrc={imageSrc} />
        <ProductDescription description={description} />
        <ProductDetails
          productName={productName}
          productType={productType}
          price={price}
          stock={stock}
        />
      </div>
      <ProductsGroup />
      <RelatedItems />
    </section>
  );
};

export default ProductPage;
