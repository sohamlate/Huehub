import React from 'react';

const ProductImage = ({ item }) => {
  const imageUrl = item.thumbnails && item.thumbnails.length > 0
    ? item.thumbnails[0]
    : item.thumbnail;

  return (
    <div className="p-2">
      <img
        src={imageUrl}
        alt={item.productName}
        className=" aspect-square object-cover w-32 rounded-md"
      />
    </div>
  );
};

export default ProductImage;
