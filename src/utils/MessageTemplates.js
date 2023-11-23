const VerifyEmailMessage = (link) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
            }
            a {
                color: #fff !important;
                text-decoration: none;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                color: #fff !important;
                background-color: #007BFF;
                border-radius: 4px;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Email Verification</h2>
            <p>Dear user,</p>
            <p>To verify your email, click on the button below:</p>
            <a href="${link}" class="button">Verify Email</a>
            <p>If you did not create an account, then ignore this email.</p>
        </div>
    </body>
    </html>
  `;
};

const ResetPasswordMessage = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }
            a {
                color: #007BFF;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>${content}</p>
        </div>
    </body>
    </html>
    `;
};

module.exports = { VerifyEmailMessage, ResetPasswordMessage };
