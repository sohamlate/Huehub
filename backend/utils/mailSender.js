const nodemailer = require("nodemailer");

const mailSender = async(email,title,body)=>{
    try{
        console.log("entrer in mailsender");
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from:"Huehub",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        });

        console.log(info);
        return info;
    }
    catch(error){
        console.log(error.message);
        console.log("error occured in mailsender");

    }
}

module.exports = mailSender ;