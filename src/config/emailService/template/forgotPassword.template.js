module.exports = (email, full_name, token) => {
  return {
    to: email,
    text: "Forgot password verification link.",
    subject: "Please reset your password.",
    html: `<div>
            <h1>Hi ${full_name}</h1>
            <p>Please reset your password</p>
            <a href=${`http://localhost:3000/reset-password?email=${email}&token=${token}`}>Verify</a>
        </div>`,
  };
};
