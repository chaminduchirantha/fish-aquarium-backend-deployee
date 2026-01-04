import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { OrdersFish } from "../model/ordersFishModel";

export const generateOrderReport = async (req: Request, res: Response) => {
  try {
    const orders = await OrdersFish.find().sort({ createdAt: -1 });

    const reportDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

    const filePath = path.join(reportDir, "orders-clean-report.pdf");

    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Title
    doc.fontSize(22).font("Helvetica-Bold").fillColor("#003566")
      .text("Fish Orders Report", { align: "center" });
    doc.moveDown(2);

    // Loop Through Orders
    orders.forEach((order: any, index: number) => {

      // Card Background
      doc.rect(30, doc.y, 550, 140)
        .fillOpacity(0.05)
        .fill("#90e0ef")
        .fillOpacity(1);

      let startY = doc.y + 10;

      // CARD CONTENT
      doc.fillColor("#000")
        .fontSize(14).font("Helvetica-Bold")

      doc.fontSize(11).font("Helvetica");

      doc.text(`Customer: ${order.firstname} ${order.lastname}`, 40, startY + 25);
      doc.text(`Email: ${order.email}`, 40, startY + 45);
      doc.text(`Fish: ${order.fishname}`, 40, startY + 65);
      doc.text(`Quantity: ${order.qty}`, 40, startY + 85);
      doc.text(`Amount: Rs. ${order.amount}`, 40, startY + 105);

      doc.text(`Status: ${order.status}`, 300, startY + 25);
      doc.text(`Order Date: ${order.orderDate}`, 300, startY + 45);

      doc.moveDown(7);

      // Page break
      if (doc.y > 700) {
        doc.addPage();
      }
    });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath);
    });

  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error });
  }
};
