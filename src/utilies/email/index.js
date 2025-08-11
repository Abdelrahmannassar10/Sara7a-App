import nodemailer from 'nodemailer';
export const sendEmail = async ({to,subject,html})=>{
    const transporter  =nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        auth:{
            user:"atef18008@gmail.com",
            pass:"ocvhcycdsqyctctd"
        },
        secure: false,
requireTLS: true,
    })
try {
  const info = await transporter.sendMail({
    from: {
      name: "Sara7a App",
      address: "atef18008@gmail.com"
    },
    to,
    subject,
    html
  });
  console.log("Message sent: %s", info.messageId);
} catch (error) {
  console.error("Email sending failed:", error);
}
}