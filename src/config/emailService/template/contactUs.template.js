module.exports = (email, user_name, message) => {
  return {
    from: email,
    text: message,
    to: process.env.EMAIL_SENDER_ACCOUNT,
    subject: `${user_name} send a contact mail at travelmeester.nl`,
    // html: `<div>
    //         <p>Sender Name: ${full_name}</p>
    //         <p>Sender Phone: ${phone}</p>
    //         <p>Sender email: ${email}</p>
    //     </div>`,
  };
};
