import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProducts } from "../../redux/slices/productsSlice";
import axios, { all } from "axios";

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
    field: "title",
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
    const response = await axios.get(
      "https://ece-project.adaptable.app/product/getAll"
    );
    const products = response.data;
    const newProducts = products.map((product, index) => {
      return {
        id: index + 1,
        img: product.imageUrl[0],
        title: product.name,
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
  getProducts();

  const addProducts = () => {
    navigate("/admin/add-products");
  };

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={addProducts}>Add New Products</button>
      </div>
      <DataTable slug="products" columns={columns} rows={allProduct} />
      {/* TEST THE API */}
      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="products" columns={columns} rows={data} />
      )} */}
    </div>
  );
};

export default AllProducts;
