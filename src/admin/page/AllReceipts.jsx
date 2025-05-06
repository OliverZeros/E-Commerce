import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import "../styles/all-order.css";

import axios from "axios";

const columns = [
  {
    field: "imageUrl",
    headerName: "Image",
    width: 200,
    renderCell: (params) => {
      return (
        <img
          className="image__product"
          src={params.row.imageUrl || "/noavatar.png"}
          alt=""
        />
      );
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Product Name",
    width: 250,
  },
  {
    field: "price",
    type: "string",
    headerName: "Price",
    width: 150,
  },
  {
    field: "quantity",
    type: "string",
    headerName: "Quantity",
    width: 150,
  },
];

const AllReceipts = () => {
  const token = useSelector((state) => state.auth.token);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const getAllOrder = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/receipt/all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const orders = response.data;
      console.log(orders);
      setAllOrders(orders);
    };
    getAllOrder();
  }, []);

  return (
    <div className="products">
      <div className="info mt-3">
        <h1>All Order</h1>
      </div>

      <div className="orders__container">
        {allOrders.map((item, index) => (
          <div className="order__card">
            <table className="order__info">
              <tr>
                <th>Name: </th>
                <td>{item.billingInfo.name}</td>
              </tr>
              <tr>
                <th>Phone Number: </th>
                <td>{item.billingInfo.phoneNumber}</td>
              </tr>
              <tr>
                <th>Address: </th>
                <td>{item.billingInfo.address}</td>
              </tr>
              <tr>
                <th>Date Created :</th>
                <td>
                  {new Date(item.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
              </tr>
            </table>

            <div className="list__produts">
              <DataTable
                slug="order"
                columns={columns}
                rows={allOrders[index].products}
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllReceipts;
