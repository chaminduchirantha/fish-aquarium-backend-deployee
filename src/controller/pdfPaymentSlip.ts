import PDFDocument from "pdfkit";
import path from "path";
import { Payemnt } from "../model/paymentModel";
import { Request , Response } from "express";

export const generatePaymentSlip = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const payments = await Payemnt.find({ email }).sort({ createdAt: -1 });

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payment found" });
        }

        const payment = payments[0];

        const doc = new PDFDocument();
        const fileName = `payment-slip-${Date.now()}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

        doc.fontSize(20).text("Aqua World - Payment Slip", { align: "center" });
        doc.moveDown();

        doc.fontSize(14).text(`Customer Email: ${payment.email}`);
        doc.text(`Phone Number: ${payment.phonenumber}`);
        doc.text(`Card Holder: ${payment.cardHolderName}`);
        doc.text(`Amount: LKR ${payment.amount}`);
        doc.text(`Payment Date: ${payment.paymentDate}`);

        doc.end();
        doc.pipe(res);

    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
