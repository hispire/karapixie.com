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
      text: "De: "+ name + "\n" +
	    "Email: "+ email + "\n" +
	    "Mensaje: \n\n"+ message,
      html: "<p><b>De: </b>" + name + 
	    "</p> <p><b>Email: </b>"+ email +
	    "</p> <h4>Mensaje: </h4><p>"+ message + "</p>"
    

  
  }
    return mailOpts;
};
