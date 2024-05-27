import React from "react";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { products } from "../data";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "title",
    type: "string",
    headerName: "Name",
    width: 250,
  },
  {
    field: "createdAt",
    type: "string",
    headerName: "Date Created",
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

const AllReceipts = () => {
  const navigate = useNavigate();

  // TEST THE API

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allproducts"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/products").then(
  //       (res) => res.json()
  //     ),
  // });

  return (
    <div className="receipts">
      <div className="info">
        <h1>All Orders</h1>
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

export default AllReceipts;
