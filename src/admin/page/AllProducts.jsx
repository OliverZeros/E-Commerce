import React from "react";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { products } from "../data";

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

  const addProducts = () => {
    navigate("/admin/add-products");
  };
  // TEST THE API

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allproducts"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/products").then(
  //       (res) => res.json()
  //     ),
  // });

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={addProducts}>Add New Products</button>
      </div>
      <DataTable slug="products" columns={columns} rows={products} />
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
