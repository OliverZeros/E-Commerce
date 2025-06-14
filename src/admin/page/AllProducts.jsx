import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProducts } from "../../redux/slices/productsSlice";
import { getAllProducts } from "../../service/productService";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "img",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Name",
    width: 250,
  },
  {
    field: "category",
    type: "string",
    headerName: "Category",
    width: 150,
  },
  {
    field: "price",
    type: "string",
    headerName: "Price",
    width: 150,
  },
  {
    field: "model",
    type: "string",
    headerName: "Model",
    width: 130,
  },
  {
    field: "color",
    type: "string",
    headerName: "Color",
    width: 150,
  },
  {
    field: "size",
    type: "string",
    headerName: "Size",
    width: 130,
  },
  {
    field: "slot",
    type: "string",
    headerName: "Slots",
    width: 120,
  },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProduct, setProduct] = useState([]);
  const getProducts = async () => {
    const response = await getAllProducts();
    const products = response.data;
    const newProducts = products.map((product, index) => {
      return {
        id: product.id,
        img: product.imageUrl[0],
        name: product.name,
        slot: product.slot,
        price: product.price,
        category: product.productType.category,
        model: product.productType.model,
        color: product.productType.color,
        size: product.productType.size,
      };
    });
    setProduct(newProducts);
    dispatch(setProducts(products));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProducts = () => {
    navigate("/admin/add-products");
  };

  return (
    <div className="products">
      <div className="info mt-3">
        <h1>All Products</h1>
        <button onClick={addProducts}>Add New Products</button>
      </div>
      <DataTable
        slug="product"
        columns={columns}
        rows={allProduct}
        fetchData={getProducts}
      />
    </div>
  );
};

export default AllProducts;
