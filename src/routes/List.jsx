import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Link } from "react-router-dom";

const List = ({ invoices, setInvoices,downloadPDF }) => {
  const deleteInvoice = (billno) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.billno !== billno)
    );
  };

  const handleDelete = (invoiceId) => {
    deleteInvoice(invoiceId);
  };

  const currentDate = dayjs();
  return (
    <Box sx={{ mt: "50px", height: "100vh" }}>
      <Box
        sx={{
          my: "20px",
          display: "flex",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          padding: "20px",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "white",
          gap: "10px",
          width: "77vw",
        }}
      >
        <TextField
          size="small"
          label={
            <div>
              <Search />
              Search
            </div>
          }
        />
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ marginRight: "5px", mt: "5px" }}>
              From:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "8px",
                  },
                }}
                defaultValue={currentDate}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ marginRight: "5px", mt: "5px" }}>To:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "8px",
                  },
                }}
                defaultValue={currentDate}
              />
            </LocalizationProvider>
          </Box>
          <Link style={{ textDecoration: "none" }} to="/">
            <Box>
              <Button variant="outlined" startIcon={<AddIcon />}>
                Create Invoice
              </Button>
            </Box>
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>SR NO</TableCell>
                <TableCell>BILL NO</TableCell>
                <TableCell align="center">INVOICE NAME</TableCell>
                <TableCell align="center">ISSUE DATE</TableCell>
                <TableCell align="center">TOTAL</TableCell>
                <TableCell align="right">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow
                  key={invoice.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {invoice.billno}
                  </TableCell>
                  <TableCell align="center">{invoice.invoice}</TableCell>
                  <TableCell align="center">
                    {dayjs(invoice.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="center">{invoice.grandTotal}</TableCell>
                  <TableCell align="right">
                    <Tooltip placement="top" title="Edit">
                      <Link to={`/Edit/${invoice.billno}`}>
                        <Button>
                          <EditIcon sx={{ color: "gray" }} />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete">
                      <Button onClick={() => handleDelete(invoice.billno)}>
                        <DeleteIcon sx={{ color: "gray" }} />
                      </Button>
                    </Tooltip>
                    <Tooltip placement="top" title="Preview">
                      <Link to={`/preview/${invoice.billno}`}>
                        <Button>
                          <RemoveRedEyeIcon sx={{ color: "gray" }} />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip placement="top" title="Download">
                      <Button onClick={downloadPDF}>
                        <ArrowDownwardIcon sx={{ color: "gray" }} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default List;