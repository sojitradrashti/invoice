import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import List from "./routes/List";
import Add from "./routes/Add";
import Edit from "./routes/Edit";
import Preview from "./routes/Preview";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";


const Array = [
  {
    path: "",
    name: "Add",
    icon: <AddIcon />,
  },
  // {
  //   path: "edit",
  //   name: "Edit",
  //   icon: <EditIcon />,
  // },
  {
    path: "list",
    name: "List",
    icon: <ListIcon />,
  },
  // {
  //   path: "preview",
  //   name: "Preview",
  //   icon: <PreviewIcon />,
  // },
];
const Navbar = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        width: "15%",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        py: 5,
        px: 2,
        bgcolor: "#F4F5FA",
        height: "100vh",
      }}
    >
      <img src="/assets/logo.png" alt="logo" style={{ width: "13vw" }} />
      {/* <Typography
        color={"black"}
        fontSize={25}
        fontWeight={600}
        textAlign={"center"}
        pb={2}
      >
        Demaze Technologies
      </Typography> */}
      {Array.map((item) => (
        <Box
          key={item.path}
          sx={{
            bgcolor:
              location.pathname === `/${item.path}` ? "#5A8BEC" : "transparent",
            px: 3,
            py: 1,
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <Link
            to={`/${item.path}`}
            style={{
              textDecoration: "none",
              color: location.pathname === `/${item.path}` ? "white" : "black",
            }}
          >
            <Box display={"flex"} gap={1}>
              {React.cloneElement(item.icon, { style: { fontSize: 20 } })}
              <Typography sx={{ fontSize: "lg" }}>{item.name}</Typography>
            </Box>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

const App = () => {
  const [invoices, setInvoices] = useState([]);
  const [mainItem, setMainitem] = useState([]);
  const [editData, setEditData] = useState({ items: [] });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [formData, setFormData] = useState({
    invoice: "",
    address: "",
    billno: "",
    date: "",
    phoneno: "",
    items: [{ selectedItem: "", price: "", discount: "", description: "" }],
    totalPrice: 0,
    totalDiscountPrice: 0,
    totalGST: 0,
    grandTotal: 0,
  });

  const EditTotalPrice = editData.items.reduce((acc, item) => {
    const price = parseFloat(item.price);
    return isNaN(price) ? acc : acc + price;
  }, 0);

  const calculateDiscountedTotalPrice = () => {
    return editData.items
      .reduce((acc, item) => {
        const price = parseFloat(item.price) || 0;
        const discount = parseFloat(item.discount) || 0;
        const discountedPrice = price * (1 - discount / 100);
        return acc + discountedPrice;
      }, 0)
      .toFixed(2);
  };

  const TotalDiscountPrice = calculateDiscountedTotalPrice();

  const EditcalculateGST = (totalPrice) => {
    const gstAmount = (totalPrice * 18) / 100;
    return gstAmount.toFixed(2);
  };

  const gst = EditcalculateGST(EditTotalPrice);

  const calculateGrandTotal = () => {
    const discouncountedTotalPrice = calculateDiscountedTotalPrice();
    const gstAmount = (discouncountedTotalPrice * 18) / 100;
    const grandTotal =
      parseFloat(discouncountedTotalPrice) + parseFloat(gstAmount);
    return grandTotal.toFixed(2);
  };
  const EditgrandTotal = calculateGrandTotal();

  console.log("editData", editData);


   const pdfRef = useRef();
  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`invoice_${previewData.billno}.pdf`);
  //   });
  // };

  return (
    <Box display={"flex"} height={"100%"} width={"100vw"} bgcolor={"#F4F5FA"}>
      <Navbar />
      <Box sx={{ height: "100%", marginLeft: "18%" }}>
        <Routes>
          <Route
            path="/list"
            element={<List invoices={invoices} setInvoices={setInvoices} />}
          />
          <Route
            path="/"
            element={
              <Add
                invoices={invoices}
                setInvoices={setInvoices}
                setMainitem={setMainitem}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
                formData={formData}
                // downloadPDF={downloadPDF}
              />
            }
          />
          <Route
            path="/edit/:billno"
            element={
              <Edit
                invoices={invoices}
                setInvoices={setInvoices}
                editData={editData}
                setEditData={setEditData}
                handleInputChange={handleInputChange}
                EditTotalPrice={EditTotalPrice}
                TotalDiscountPrice={TotalDiscountPrice}
                gst={gst}
                EditgrandTotal={EditgrandTotal}
                calculateGrandTotal={calculateGrandTotal}
                // downloadPDF={downloadPDF}
              />
            }
          />
          <Route
            path="/preview/:billno"
            element={
              <Preview
                invoices={invoices}
                mainItems={mainItem}
                calculateGrandTotal={calculateGrandTotal}
                // downloadPDF={downloadPDF}
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;