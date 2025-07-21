import React from "react";
import ProductCard from "./ProductCard"; 

const ProductList = ({ products, isAdminView = false, onEditProduct, onDeleteProduct }) => { 
  return (
    <div className="container py-4">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 justify-content-center">
        {products.map((product) => (
          <div key={product.id} className="col d-flex">
            <ProductCard 
              product={product} 
              onDelete={isAdminView ? onDeleteProduct : undefined} 
              onEdit={isAdminView ? onEditProduct : undefined}
              isAdmin={isAdminView}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;