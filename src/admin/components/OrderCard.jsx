import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "../styles/data-table.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const OrderCard = ({ columns, rows, slug }) => {
  const navigation = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const handleDelete = async (id) => {
    const data = new FormData();
    data.append("productId", id);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_URL}/product/delete`,
      headers: {
        Authorization: token,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 150,

    renderCell: (params) => {
      return (
        <div className="action">
          <div
            onClick={() => {
              navigation(`/admin/update-${slug}/${params.row.id}`, {
                state: { id: params.row.id },
              });
            }}
          >
            <i class="ri-draft-line update"></i>
          </div>
          <div
            className="delete"
            onClick={async () => {
              return await handleDelete(params.row.id);
            }}
          >
            <i class="ri-delete-bin-5-line"></i>
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={[...columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //     quickFilterProps: { debounceMs: 500 },
        //   },
        // }}
        pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        // disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default OrderCard;
