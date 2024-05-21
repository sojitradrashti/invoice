import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import jsPDF from "jspdf";

const Edit = ({
  mainItems,
  invoices,
  setEditData,
  editData,
  calculateGrandTotal,
  EditTotalPrice,
  gst,
  setInvoices,
  EditgrandTotal,
}) => {
  let { billno } = useParams();
  useEffect(() => {
    const editData = invoices.find((item) => item.billno === billno);
    setEditData(editData);
  }, [billno, invoices]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleItemChange = (index, field, value) => {
    setEditData((prevData) => {
      const updateitems = [...prevData.items];
      updateitems[index][field] = value;
      return {
        ...prevData,
        items: updateitems,
      };
    });
  };

  const addItem = () => {
    setEditData((prevData) => ({
      ...prevData,
      items: [
        ...(prevData.items || []),
        { selectedItem: "", price: 0, discounts: 0, description: "" },
      ],
    }));
  };

  const handleEditDelete = (index) => {
    setEditData((prevData) => {
      const updateitems = [...prevData.items];
      updateitems.splice(index, 1);
      return {
        ...prevData,
        items: updateitems,
      };
    });
  };
  const handleSave = () => {
    const updatedGrandTotal = calculateGrandTotal(editData.items);
    const updatedEditData = {
      ...editData,
      grandTotal: updatedGrandTotal,
    };
    const updatedInvoices = invoices.map((invoice) =>
      invoice.billno === editData.billno ? updatedEditData : invoice
    );
    setInvoices(updatedInvoices);
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
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
    doc.text(`Date: ${dayjs(editData.date).format("DD-MM-YYYY")}`, 150, 70);
    doc.text(`Bill No: ${editData.billno}`, 150, 80);
    doc.text(`HSN No: 99831`, 150, 90);

    doc.text(`Invoice to: ${editData.invoice}`, 10, 70);
    doc.text(`Address: ${editData.address}`, 10, 80);

    doc.setFillColor("#A0DEFF");
    doc.rect(10, 110, 190, 15, "F");
    doc.setTextColor("#000000");
    doc.text("SERVICE DESCRIPTION", 20, 120);
    doc.text("TOTAL", 155, 120);

    doc.setFillColor(241, 251, 255);
    doc.rect(10, 130, 190, 80, "F");
    let currentYPosition = 140;
    editData.items.forEach((item) => {
      doc.text(`${item.selectedItem}`, 20, currentYPosition);
      doc.text(`${item.price}`, 170, currentYPosition);
      doc.text(`ORIGINAL PRICE`, 90, currentYPosition);
      currentYPosition += 10;
    });
    doc.text(`Total Price: ${editData.totalPrice}`, 150, currentYPosition);
    doc.text(`GST: ${editData.totalGST}`, 150, currentYPosition + 10);
    doc.text(`Grand Total: ${editData.grandTotal}`, 150, currentYPosition + 20);

    doc.text(` ${editData.phoneno}`, 10, 220);
    doc.text("info@demaze.in", 100, 220);
    doc.text("demaze.in", 180, 220);

    doc.save(`invoice_${editData.billno}.pdf`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          my: "50px",
          p: "30px",
          bgcolor: "white",
          width: "55vw",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        <img src="/assets/logo.png" alt="logo" style={{ width: "13vw" }} />
        <Typography sx={{ width: "35%" }}>
          D-814, Ganesh Glory 11, Jagatpur Road, SG Highway, Gota, Ahmedabad,
          382470
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              mt: "40px",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography> Invoice to: </Typography>
              <TextField
                placeholder="Company Name"
                variant="outlined"
                value={editData ? editData.invoice : ""}
                size="small"
                onChange={handleFieldChange}
                name="invoice"
                sx={{ width: "200px" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "10px",
              }}
            >
              <Typography>Address: </Typography>
              <TextField
                multiline
                rows={4}
                maxRows={4}
                size="small"
                value={editData ? editData.address : ""}
                onChange={handleFieldChange}
                placeholder="Address"
                variant="outlined"
                name="address"
                sx={{ width: "200px" }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              mt: "33px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                Date: {dayjs(editData.date).format("DD-MM-YYYY")}{" "}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "5px",
              }}
            >
              <Typography>Bill No: {editData.billno}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "5px",
              }}
            >
              <Typography>HSN No: 99831</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: "20px" }} />
        <Box>
          {editData.items?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: "10px",
                border: "1px solid lightgray",
                padding: "10px",
                mx: "5px",
                my: "25px",
                borderRadius: "5px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <FormControl sx={{ width: "300px" }}>
                    <InputLabel id={`item-label-${index}`}>
                      Select Item
                    </InputLabel>
                    <Select
                      labelId={`item-label-${index}`}
                      value={item.selectedItem}
                      label="Select Item"
                      onChange={(e) =>
                        handleItemChange(index, "selectedItem", e.target.value)
                      }
                      name="selectedItem"
                      size="small"
                    >
                      <MenuItem value="Web design">Web design</MenuItem>
                      <MenuItem value="Mobile application">
                        Mobile application
                      </MenuItem>
                      <MenuItem value="UI/UX">UI/UX</MenuItem>
                      <MenuItem value="App development">
                        App development
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    variant="outlined"
                    id={`price-${index}`}
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    name="price"
                    sx={{ width: "150px" }}
                  />
                </Box>
                <Box>
                  <IconButton onClick={() => handleEditDelete(index)}>
                    <CloseIcon color="primary" />
                  </IconButton>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "10px",
                }}
              >
                <TextField
                  sx={{ width: "42%" }}
                  multiline
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Description"
                  required
                  name="description"
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Discount"
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    handleItemChange(index, "discounts", e.target.value)
                  }
                  name="discounts"
                  sx={{ width: "150px" }}
                  required
                /> */}
        <Box>
          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{
              border: "1px solid lightblue",
              mt: "10px",
            }}
          >
            Add item
          </Button>
        </Box>
        <Divider sx={{ mt: "10px" }} />
        <Box sx={{ mt: "90px", mb: "50px" }}>
          <Box
            sx={{
              p: "20px",
              m: "10px",
              fontWeight: "bold",
              display: "flex",
              bgcolor: "#A0DEFF",
              justifyContent: "space-between",
            }}
          >
            <Typography>SERVICE DECSRIPTION</Typography>
            <Typography>TOTAL</Typography>
          </Box>

          <Box>
            <Box
              sx={{
                bgcolor: "#E1F7F5",
                p: "30px",

                width: "89%",
                m: "10px",
              }}
            >
              {editData.items?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <Box sx={{ width: "200px" }}>
                    <Typography>{item.selectedItem || "TITAL"}</Typography>
                  </Box>
                  <Box sx={{ mr: "150px", width: "200px" }}>
                    <Typography>ORIGINAL PRICE:</Typography>
                  </Box>
                  <Box>
                    <Typography>{item.price || "0.00"}</Typography>
                  </Box>
                </Box>
              ))}
              <Divider color="#A9CFE1" sx={{ mt: "20px" }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  m: "15px",
                }}
              >
                <Box sx={{ m: "10px" }}>
                  <Typography>Total Price : </Typography>
                  <Typography>GST (18%) : </Typography>
                  {/* <Typography>Discounted Price</Typography> */}
                  <Typography>Grand Total :</Typography>
                </Box>
                <Box sx={{ my: "10px" }}>
                  <Typography> {EditTotalPrice} </Typography>
                  <Typography> {gst} </Typography>
                  {/* <Typography> {TotalDiscountPrice} </Typography> */}
                  <Typography> {EditgrandTotal} </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ mt: "20px" }}>
            <Typography>PAYABLE TO</Typography>
            <Typography>Mr Krupal Chaudhary</Typography>
            <Typography>GSTIN Number : 24CEYPC9769J1ZK</Typography>
          </Box>
          <Box sx={{ mt: "20px" }}>
            <Typography>BANK DETAILS</Typography>
            <Typography>Bank : BANKNAME</Typography>
            <Typography> A/C no : 000000000000000 </Typography>
            <Typography>Name : Demaze Technologies </Typography>
            <Typography> IFSC Code : HDFCXXXXXXX </Typography>
            <Typography> Phone : +91 7016660537 </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: "#E1F7F5",
            mt: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Box>
            <Typography>{editData ? editData.phoneno : ""}</Typography>
          </Box>
          <Typography>info@demaze.in</Typography>
          <Typography>demaze.in</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          mt: "50px",
          mx: "8px",
          height: "30vh",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Box sx={{ width: "19vw" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ mx: "20px", mt: "20px", px: "95px", py: "5px" }}
          >
            SAVE
          </Button>
          <Link
            to={`/preview/${editData.billno}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              onClick={handleSave}
              variant="outlined"
              sx={{ mx: "20px", mt: "20px", px: "80px", py: "5px" }}
            >
              PREVIEW
            </Button>
          </Link>
          <Button
            onClick={downloadPDF}
            variant="outlined"
            sx={{ mx: "20px", mt: "20px", px: "70px", py: "5px" }}
          >
            DOWNLOAD
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Edit;
