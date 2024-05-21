import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import jsPDF from "jspdf";

const Preview = ({ invoices }) => {
  let { billno } = useParams();
  const previewData = invoices.find((item) => item.billno === billno);
  console.log("invoices", invoices);

  // const downloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.save(`invoice_${previewData.billno}.pdf`);
  // };

  const downloadPDF = () => {
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
    doc.text(`Date: ${dayjs(previewData.date).format("DD-MM-YYYY")}`, 150, 70);
    doc.text(`Bill No: ${previewData.billno}`, 150, 80);
    doc.text(`HSN No: 99831`, 150, 90);

    doc.text(`Invoice to: ${previewData.invoice}`, 10, 70);
    doc.text(`Address: ${previewData.address}`, 10, 80);

    doc.setFillColor("#A0DEFF");
    doc.rect(10, 110, 190, 15, "F");
    doc.setTextColor("#000000");
    doc.text("SERVICE DESCRIPTION", 20, 120);
    // doc.text("Description", 75, 105);
    doc.text("TOTAL", 155, 120);

    doc.setFillColor(241,251,255);
    doc.rect(10,130,190,80,"F");
    let currentYPosition = 140;
    previewData.items.forEach((item) => {
      doc.text(`${item.selectedItem}`, 20, currentYPosition);
      doc.text(`${item.price}`, 170, currentYPosition);
      doc.text(`ORIGINAL PRICE`, 90, currentYPosition);
      currentYPosition += 10;
    });
    doc.text(`Total Price: ${previewData.totalPrice}`, 150, currentYPosition);
    doc.text(`GST: ${previewData.totalGST}`, 150, currentYPosition + 10);
    // doc.text(`Discounted Price: ${previewData.totalDiscountPrice}`, 150, currentYPosition + 20);
    doc.text(`Grand Total: ${previewData.grandTotal}`, 150, currentYPosition + 20);

    doc.text(`Phone: ${previewData.phoneno}`, 10, 210);
    doc.text("info@demaze.in", 100, 210);
    doc.text("demaze.in", 180, 210);

    doc.save(`invoice_${previewData.billno}.pdf`);
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
        <Box sx={{ borderRadius: "10px", padding: "15px" }}>
          <img src="/assets/logo.png" alt="logo" style={{ width: "13vw" }} />
          <Box
            sx={{
              mt: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ width: "45%" }}>
                D-814, Ganesh Glory 11, Jagatpur Road, SG Highway, Gota,
                Ahmedabad, 382470
              </Typography>
            </Box>

            <Box sx={{ display: "block", textAlign: "right" }}>
              <Typography>HSN No: 99831</Typography>
              <Typography>
                Date: {dayjs(previewData.date).format("DD-MM-YYYY")}
              </Typography>
              <Typography>Bill No: {previewData.billno}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: "20px" }} />
        <Box
          sx={{
            bgcolor: "#A0DEFF",
            px: "20px",
            py: "20px",
            my: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>Item</Typography>
          <Typography>Description</Typography>
          {/* <Typography>Discount</Typography> */}
          <Typography>Price</Typography>
        </Box>
        <Box>
          {previewData.items.map((item, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "#E1F7F5",
                px: "20px",
                py: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography>{item.selectedItem}</Typography>
              <Typography>{item.description}</Typography>
              {/* <Typography>{item.discount}</Typography> */}
              <Typography>{item.price}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mt: "20px" }} />
        <Box sx={{ mt: "20px" }}>
          <Typography> Invoice to: {previewData.invoice}</Typography>
          <Typography>Address: {previewData.address}</Typography>
        </Box>
        <Box
          sx={{
            mt: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography>Thanks for your business</Typography>
          </Box>
          <Box>
            <Box sx={{ display: "block", textAlign: "right" }}>
              <Typography>Total Price : {previewData.totalPrice} </Typography>
              <Typography>GST : {previewData.totalGST}</Typography>{" "}
              <Typography>
                Discounted Price : {previewData.totalDiscountPrice}
              </Typography>
              <Typography>Grand Total :{previewData.grandTotal} </Typography>
            </Box>
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
          <Typography>{previewData.phoneno}</Typography>
          <Typography>info@demaze.in</Typography>
          <Typography>demaze.in</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          mt: "50px",
          mx: "8px",
          height: "21vh",
          boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Box sx={{ width: "19vw" }}>
          <Link
            to={`/edit/${previewData.billno}`}
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="outlined"
              sx={{ mx: "20px", mt: "20px", px: "96px", py: "5px" }}
            >
              EDIT
            </Button>
          </Link>

          <Button
            variant="contained"
            sx={{ mx: "20px", mt: "20px", px: "70px", py: "5px" }}
            onClick={downloadPDF}
          >
            DOWNLOAD
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Preview;
