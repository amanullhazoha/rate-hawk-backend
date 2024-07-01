module.exports = (email, full_name) => {
  return {
    to: email,
    text: "Verify your email address.",
    subject: "Please verify your email address.",
    html: `<div>
            <h1>Hi ${full_name}</h1>
            <p>Please verify your email</p>
            <a href=${`${process.env.BASE_DOMAIN}/api/v1/public/email-verify?email=${email}`}>Verify</a>
        </div>`,
  };
};
