import React, { useEffect, useState, useRef } from "react";
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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import jsPDF from "jspdf";
import { MobileDatePicker } from "@mui/x-date-pickers";

const Add = ({
  invoices,
  setInvoices,
  handleInputChange,
  formData,
  setFormData,
  download,
}) => {
  const [selectedItemsTitle, setSelectedItemsTitle] = useState("");
  const [prices, setPrices] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [items, setItems] = useState([
    { selectedItem: "", price: "", discount: "", description: "" },
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalPrice: calculateTotalPrice(),
      totalDiscountPrice: calculateTotalDiscount(),
      totalGST: calculateTotalGST(),
      grandTotal: calculateGrandTotal(),
    }));
  }, [items]);

  const handleAddItem = () => {
    const newItem = {
      selectedItem: "",
      price: "",
      discount: "",
      description: "",
    };
    setItems([...items, newItem]);
  };

  const handleItemSelect = (event, index) => {
    const { value } = event.target;
    const newItems = [...items];
    newItems[index].selectedItem = event.target.value;
    setItems(newItems);
    setFormData((preState) => ({
      ...preState,
      items: newItems.map((item, i) =>
        i === index ? { ...items, selectedItem: value } : item
      ),
    }));
  };

  const handlePriceChange = (index, price) => {
    const newItems = [...items];
    newItems[index].price = price;
    setItems(newItems);
    const newPrices = [...prices];
    newPrices[index] = parseFloat(price) || 0;
    setPrices(newPrices);
    setFormData((prevState) => ({
      ...prevState,
      prices: newPrices.join(","),
    }));
  };

  const handleDescriptionChange = (index, description) => {
    const newItems = [...items];
    newItems[index].description = description;
    setItems(newItems);
    setFormData((prevState) => ({
      ...prevState,
      items: newItems,
    }));
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  const updateSelectedItemsTitle = () => {
    const selectedItems = items
      .map((item) => item.selectedItem)
      .filter((item) => !!item);
    setSelectedItemsTitle(selectedItems.join(", "));
  };

  useEffect(() => {
    updateSelectedItemsTitle();
  }, [items]);

  const calculateGST = (price) => {
    return (price * 18) / 100;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      totalPrice += price;
    });
    return totalPrice.toFixed(2);
  };

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;
    items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const discount = parseFloat(item.discount) || 0;
      const discountedPrice = price - (price * discount) / 100;
      totalDiscount += discountedPrice;
    });
    return totalDiscount.toFixed(2);
  };

  const calculateTotalGST = () => {
    let totalGST = 0;
    items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      totalGST += calculateGST(price);
    });
    return totalGST.toFixed(2);
  };

  const calculateGrandTotal = () => {
    const totalGST = parseFloat(calculateTotalGST());
    const totalDiscount = parseFloat(calculateTotalDiscount());
    const grandTotal = totalGST + totalDiscount;
    return grandTotal.toFixed(2);
  };

  // const handleDiscountChange = (index, discount) => {
  //   const newItems = [...items];
  //   newItems[index].discount = discount;
  //   setItems(newItems);
  //   const newDiscounts = [...discounts];
  //   newDiscounts[index] = parseFloat(discount) || 0;
  //   setDiscounts(newDiscounts);
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     discounts: newDiscounts.join(","),
  //   }));
  // };

  const handleSaveInvoice = () => {
    setInvoices([...invoices, formData]);
  };

  console.log("formdata", formData);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Invoice", 20, 10);
    doc.text(`Date: ${dayjs(formData.date).format("DD-MM-YYYY")}`, 20, 20);
    doc.text(`Bill No: ${formData.billno}`, 20, 30);
    doc.text(`Invoice to: ${formData.invoice}`, 20, 40);
    doc.text(`Address: ${formData.address}`, 20, 50);

    doc.text("Items:", 20, 60);
    formData.items.forEach((item, index) => {
      doc.text(
        `${item.selectedItem}: ${item.description} - ${item.price}`,
        20,
        70 + index * 10
      );
    });

    const itemsLength = formData.items.length;
    doc.text(
      `Total Price: ${formData.totalPrice}`,
      20,
      70 + itemsLength * 10 + 10
    );
    doc.text(`GST: ${formData.totalGST}`, 20, 80 + itemsLength * 10 + 10);
    doc.text(
      `Discounted Price: ${formData.totalDiscountPrice}`,
      20,
      90 + itemsLength * 10 + 10
    );
    doc.text(
      `Grand Total: ${formData.grandTotal}`,
      20,
      100 + itemsLength * 10 + 10
    );

    doc.text(`Phone: ${formData.phoneno}`, 20, 110 + itemsLength * 10 + 10);
    doc.text("info@demaze.in", 20, 120 + itemsLength * 10 + 10);
    doc.text("demaze.in", 20, 130 + itemsLength * 10 + 10);

    doc.save(`invoice_${formData.billno}.pdf`);
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
        <Typography sx={{ width: "35%", mt: "40px" }}>
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
              {/* <Typography> Invoice to: </Typography> */}
              <TextField
                placeholder="Company Name"
                label=" Invoice to"
                variant="outlined"
                size="small"
                autoComplete="off"
                value={formData.invoice}
                onChange={handleInputChange}
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
              {/* <Typography>Address: </Typography> */}
              <TextField
                label=" Address"
                multiline
                rows={2}
                size="small"
                placeholder="Address"
                variant="outlined"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                sx={{ width: "200px" }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              mt: "39px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* <Typography>Date: </Typography> */}
              <LocalizationProvider
                value={formData.date}
                dateAdapter={AdapterDayjs}
                label="Date"
              >
                <MobileDatePicker
                  label="Date"
                  onChange={(e) => {
                    if (e && e.$d) {
                      handleInputChange({
                        target: {
                          value: e.$d,
                          name: "date",
                        },
                      });
                    }
                  }}
                  sx={{
                    "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                      p: "8px",
                      width: "170px",
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "5px",
              }}
            >
              {/* <Typography>Bill No: </Typography> */}

              <TextField
                placeholder="#5037"
                label=" Bill No"
                variant="outlined"
                value={formData.billno}
                onChange={handleInputChange}
                size="small"
                autoComplete="off"
                name="billno"
                sx={{ width: "200px" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "15px",
              }}
            >
              <Typography>HSN No: 99831 </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: "20px" }} />
        <Box>
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid lightgray",
                padding: "10px",
                mx: "5px",
                my: "25px",
                borderRadius: "5px",
              }}
            >
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  key={index}
                  sx={{
                    width: "70%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <FormControl sx={{ width: "300px" }}>
                    <InputLabel>Select Item</InputLabel>
                    <Select
                      value={item.selectedItem}
                      onChange={(e) => handleItemSelect(e, index)}
                      label="select item"
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
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                    size="small"
                    id={`price-${index}`}
                    variant="outlined"
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={item.price}
                    sx={{ width: "150px" }}
                  />
                </Box>
                <Box>
                  <IconButton onClick={() => handleDeleteItem(index)}>
                    <CloseIcon color="primary" />
                  </IconButton>

                  {/* <TextField
                  size="small"
                  onChange={(e) => handleDiscountChange(index, e.target.value)}
                  variant="outlined"
                  placeholder="Discount"
                  type="number"
                  name="discounts"
                  sx={{ width: "150px" }}
                  required
                /> */}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  sx={{ width: "42%" }}
                  multiline
                  rows={2}
                  cols={75}
                  className="border border-gray-300 w-[520px] rounded p-2"
                  placeholder="Description"
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  required
                  value={item.description}
                  name="description"
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box>
          <Button
            startIcon={<AddIcon />}
            sx={{
              border: "1px solid lightblue",
              mt: "10px",
            }}
            onClick={handleAddItem}
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
            <Box>SERVICE DECSRIPTION</Box>
            <Box>TOTAL</Box>
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
              {items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <Box sx={{ width: "200px" }}>
                    <Box>
                      <Typography>{item.selectedItem || "TITLE"}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mr: "150px", width: "200px" }}>
                    <Typography>ORIGINAL PRICE: </Typography>
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
                  {/* <Typography>Discounted Price </Typography> */}
                  <Typography sx={{ fontWeight: "600" }}>
                    Grand Total :{" "}
                  </Typography>
                </Box>
                <Box sx={{ my: "10px" }}>
                  <Typography> {calculateTotalPrice()} </Typography>
                  <Typography> {calculateTotalGST()} </Typography>
                  {/* <Typography> {calculateTotalDiscount()} </Typography> */}
                  <Typography sx={{ fontWeight: "600" }}>
                    {" "}
                    {calculateGrandTotal()}{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

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
          <Box sx={{ width: "220px", bgcolor: "white" }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Phone No</InputLabel>
              <Select
                name="phoneno"
                label="phone No"
                value={formData.phoneno}
                onChange={handleInputChange}
              >
                <MenuItem value=" +91 7069633777 ">Deep Suthar</MenuItem>
                <MenuItem value=" +91 7016660537 ">Krupal Chaudhary</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography>info@demaze.in</Typography>
          </Box>
          <Box>
            <Typography>demaze.in</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: "50px",
          mx: "8px",
          height: "28vh",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Box sx={{ width: "19vw" }}>
          <Button
            onClick={handleSaveInvoice}
            variant="contained"
            sx={{ mx: "20px", mt: "20px", px: "95px", py: "5px" }}
          >
            SAVE
          </Button>
          <Link
            to={`/preview/${formData.billno}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              onClick={handleSaveInvoice}
              variant="outlined"
              sx={{ mx: "20px", mt: "20px", px: "80px", py: "5px" }}
            >
              PREVIEW
            </Button>
          </Link>
          {/* <Button
            variant="outlined"
            sx={{ mx: "20px", mt: "20px", px: "96px", py: "5px" }}
          >
            EDIT
          </Button> */}

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

export default Add;
