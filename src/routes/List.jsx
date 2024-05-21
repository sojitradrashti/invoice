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
  InputAdornment,
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
import jsPDF from "jspdf";

const List = ({ invoices, setInvoices,setMainitem }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.billno.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoice.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const deleteInvoice = (billno) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.billno !== billno)
    );
  };

  const handleDelete = (invoiceId) => {
    deleteInvoice(invoiceId);
  };
  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    const logoImg = new Image();
    logoImg.src = "/assets/logo.png";
    doc.addImage(logoImg, "PNG", 10, 10, 50, 15);

    doc.text(
      `D-814, Ganesh Glory 11,
Jagatpur Road, SG Highway, 
Gota, Ahmedabad, 382470`,
      10,
      40
    );
    doc.text(`Date: ${dayjs(invoice.date).format("DD-MM-YYYY")}`, 150, 70);
    doc.text(`Bill No: ${invoice.billno}`, 150, 80);
    doc.text(`HSN No: 99831`, 150, 90);

    doc.text(`Invoice to: ${invoice.invoice}`, 10, 70);
    doc.text(`Address: ${invoice.address}`, 10, 80);

    doc.setFillColor("#A0DEFF");
    doc.rect(10, 110, 190, 15, "F");
    doc.setTextColor("#000000");
    doc.text("SERVICE DESCRIPTION", 20, 120);
    // doc.text("Description", 75, 105);
    doc.text("TOTAL", 155, 120);

    doc.setFillColor(241,251,255);
    doc.rect(10,130,190,80,"F");
    let currentYPosition = 140;
    invoice.items.forEach((item) => {
      doc.text(`${item.selectedItem}`, 20, currentYPosition);
      doc.text(`${item.price}`, 170, currentYPosition);
      doc.text(`ORIGINAL PRICE`, 90, currentYPosition);
      currentYPosition += 10;
    });
    doc.text(`Total Price: ${invoice.totalPrice}`, 150, currentYPosition);
    doc.text(`GST: ${invoice.totalGST}`, 150, currentYPosition + 10);
    // doc.text(`Discounted Price: ${previewData.totalDiscountPrice}`, 150, currentYPosition + 20);
    doc.text(`Grand Total: ${invoice.grandTotal}`, 150, currentYPosition + 20);



    doc.text(`${invoice.phoneno}`, 10, 220);
    doc.text("info@demaze.in", 100, 220);
    doc.text("demaze.in", 180, 220);

    doc.save(`invoice_${invoice.billno}.pdf`);
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
      placeholder="Search"
      autoComplete="off"
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      sx={{ width: '220px' }} // Adjust width as needed
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
              {filteredInvoices.map((invoice, index) => (
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
                      <Button onClick={() => downloadPDF(invoice)}>
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