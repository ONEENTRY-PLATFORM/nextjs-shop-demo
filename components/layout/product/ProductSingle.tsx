import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';

import ProductDescription from './product-single/ProductDescription';
import ProductDetails from './product-single/ProductDetails';
import ProductImage from './product-single/ProductImage';

interface ProductProps {
  product: IProductsEntity;
}

const ProductSingle: React.FC<ProductProps> = ({ product }) => {
  // const { title, price, availableForSale, description, featuredImage } = product;

  // console.log(product);

  return (
    <div className="mb-16 flex flex-row gap-10 max-md:max-w-full max-md:flex-wrap">
      <ProductImage
        imageSrc={product.attributeValues?.pic.value.downloadLink}
        alt={product.localizeInfos.title}
      />
      <ProductDescription
        description={product.attributeValues?.description.value.plainValue}
      />
      <ProductDetails
        title={product.localizeInfos.title}
        price={product.price}
        // availableForSale={availableForSale}
      />
    </div>
  );
};

export default ProductSingle;
