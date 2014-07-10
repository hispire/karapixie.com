var nodemailer = require('nodemailer');

this.smtpConfig = nodemailer.createTransport('SMTP', {
    //service: 'Gmail',
    host: "thsr1.supercp.com",
    secureConnection: true,
    port: 465,
    auth: {
      user: "kp@karapixie.com",
      pass: "psw"
    }
  });

this.mailOptions = function (email, name, subject, message) {
  var mailOpts = {
      from: name + ' <' + email + '>' ,
      to: 'kp@karapixie.com',
      //replace it with id you want to send multiple must be separated by ,(comma)
      subject: subject,
      //generateTextFromHTML: true,
      text: "From: "+ name + "\n" +
	    "Email: "+ email + "\n" +
	    "Subject: "+ subject + "\n" +
	    "Messsage: \n\n"+ message,
      html: "<p><b>From: </b>" + name + 
	    "</p> <p><b>Email: </b>"+ email +
	    "</p> <p><b>Subject: </b>"+ subject +
	    "</p> <h4>Message: </h4><p>"+ message + "</p>"
    

  
  }
    return mailOpts;
};
