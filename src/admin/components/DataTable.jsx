import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteProduct } from "../../service/productService";
import { toast } from "react-toastify";
import "../styles/data-table.css";

const DataTable = ({ columns, rows, slug, fetchData }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    try {
      await deleteProduct(id, token);
      toast.success("Item deleted successfully");
      if (fetchData) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete item", error);
      toast.error("Failed to delete item.");
    }
  };

  const actionColumn = {
    field: "action",
    headerName: "Actions",
    width: 120,
    sortable: false,
    renderCell: (params) => {
      return (
        <div className="admin__table-actions">
          <button
            className="admin__action-btn edit"
            title="Edit Product"
            onClick={() => {
              navigate(`/admin/update-${slug}/${params.row.id}`, {
                state: { id: params.row.id },
              });
            }}
          >
            <i className="ri-pencil-line"></i>
          </button>
          <button
            className="admin__action-btn delete"
            title="Delete Product"
            onClick={() => handleDelete(params.row.id)}
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      );
    },
  };

  const dataGridColumns =
    slug === "user" || slug === "order" ? columns : [...columns, actionColumn];

  return (
    <div className="admin__table-card">
      <DataGrid
        rows={rows}
        columns={dataGridColumns}
        autoHeight
        rowHeight={60}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={slug === "order" ? {} : { toolbar: GridToolbar }}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        disableColumnFilter={false}
        disableColumnSelector={false}
      />
    </div>
  );
};

export default DataTable;
