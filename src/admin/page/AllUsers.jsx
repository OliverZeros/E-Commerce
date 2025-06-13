import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../service/userService";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "username",
    type: "string",
    headerName: "User Name",
    width: 200,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 250,
  },
  {
    field: "category",
    type: "string",
    headerName: "Interested Category",
    width: 220,
  },
  {
    field: "model",
    type: "string",
    headerName: "Interested Model",
    width: 220,
  },
  {
    field: "color",
    type: "string",
    headerName: "Interested Color",
    width: 220,
  },
  {
    field: "size",
    type: "string",
    headerName: "Interested Size",
    width: 220,
  },
];

const AllUsers = () => {
  const token = useSelector((state) => state.auth.token);
  const [allUser, setUser] = useState([]);
  const getUsers = async () => {
    const response = await getAllUsers(token);
    const users = response.data;
    const newUser = users.map((user, index) => {
      return {
        id: index,
        username: user.username,
        email: user.email,
        category: user.survey.category,
        model: user.survey.model,
        color: user.survey.color,
        size: user.survey.size,
      };
    });
    setUser(newUser);
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="products">
      <div className="info mt-3">
        <h1>All Users</h1>
      </div>
      <DataTable slug="user" columns={columns} rows={allUser} />
    </div>
  );
};

export default AllUsers;
