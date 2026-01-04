import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendOrderConfirmationMail = async (to: string, name: string, address:string,orderDate:string,orderType:string, fishname:string , price:string,qty:number,  orderId: string) => {
  const mailOptions = {
    from: "chaminduchirantha10@gmail.com",
    to,
    subject: "Order Confirmation - Fish Aquarium Store",
    html: `
      <h2>Hi ${name},</h2>
      <p>Your address : ${address}<p>
      <p>order date :  ${orderDate}<p>
      <p>order type : ${orderType}<p>
      <p>Fish name : ${fishname}<p>
      <p>Fish price : ${price}<p>
      <p>Fish Qty : ${qty}<p>
      <p>Your order has been placed successfully! 🎉</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>Thank you for shopping with us.</p>

      <hr />
      <p>Fish Aquarium Store</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationMailAccessories = async (to: string, name: string, address:string,orderDate:string,orderType:string, itemname:string , price:string,qty:number,  orderId: string) => {
  const mailOptions = {
    from: "chaminduchirantha10@gmail.com",
    to,
    subject: "Order Confirmation - Fish Aquarium Store",
    html: `
      <h2>Hi ${name},</h2>
      <p>Your address : ${address}<p>
      <p>order date :  ${orderDate}<p>
      <p>order type : ${orderType}<p>
      <p>Item name : ${itemname}<p>
      <p>Item price : ${price}<p>
      <p>Item Qty : ${qty}<p>
      <p>Your order has been placed successfully! 🎉</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>Thank you for shopping with us.</p>

      <hr />
      <p>Fish Aquarium Store</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendDeliveryEmail = async (delivery: any) => {

  const mapLink = `https://www.google.com/maps?q=${delivery.location.lat},${delivery.location.lng}`;


  await transporter.sendMail({
    from: "chaminduchirantha10@gmail.com",
    to: "chaminduchirantha10@gmail.com", // Change admin email
    subject: "New Delivery Request Received",
    html: `
      <h2>New Delivery Request</h2>

      <p><b>Name:</b> ${delivery.customername}</p>
      <p><b>Phone:</b> ${delivery.phonenumber}</p>
      <p><b>Email:</b> ${delivery.email}</p>
      <p><b>Address:</b> ${delivery.address}</p>
      <p><b>City:</b> ${delivery.city}</p>
      <p><b>Postal Code:</b> ${delivery.postelCode}</p>
      <p><b>Delivery Date:</b> ${delivery.deliveryDate}</p>
      <p><b>Delivery Time:</b> ${delivery.deliveryTime}</p>

      <h3>Google Location Link:</h3>
      <a href="${mapLink}" target="_blank">${mapLink}</a>
    `
  });
};




export const sendOrderConfirmationMailPayment = async (to: string, name: string, phonenumber:string , paymentId: string) => {
  const mailOptions = {
    from: "chaminduchirantha10@gmail.com",
    to,
    subject: "Payment Successfuly - Fish Aquarium Store",
    html: `
      <p>name : ${name}<p>
      <p>phone number:  ${phonenumber}<p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>

      <hr />
      <p>Fish Aquarium Store</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


