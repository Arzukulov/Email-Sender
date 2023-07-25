import Imap from 'imap';
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import * as nodemailer from "nodemailer";
import IAuth from '../interfaces/IAuth.js';

export async function sendMail(fromEmail: string, password: string, toEmail: string, topic: string) {
    try {
        const imapConfig = {
          user: fromEmail,
          password: password,
          host: "imap.yandex.ru", // Replace with your IMAP server address
          port: 993,
          tls: true,
        };
    
        const imapClient = new Imap(imapConfig);
    
        function handleError(err: Error) {
          console.error("IMAP Ошибка:", err);
          imapClient.end();
        }
    
        imapClient.once("ready", () => {
            console.log("IMAP соединение установлено");
    
            let authInfo: IAuth = {
                host: fromEmail.indexOf('gmail.com') != -1 && 'smtp.gmail.com' || 'smtp.yandex.ru',
                port: 465,
                secure: true,
                auth: {
                    user: fromEmail,
                    pass: password
                },
            }
            
            const transporter = nodemailer.createTransport(authInfo);
    
            const mailOptions = {
                from: fromEmail,
                to: toEmail,
                subject: "Test mail",
                text: "Hello! This is test mail!",
            };
          
            const mail = new MailComposer(mailOptions);
            mail.compile().build((error, rawMessage) => {
                if (error) {
                    console.error(error);
                } else {
                    transporter.sendMail(
                    {
                        ...mailOptions,
                        raw: rawMessage,
                    },
                    async (error, info) => {
                        if (error) {
                            console.error(error);
                        } else {
                            imapClient.openBox("Sent", false, (err, mailbox) => {
                                if (err) {
                                    handleError(err);
                                } else {
                                    imapClient.append(rawMessage, { mailbox: "Sent" }, (error) => {
                                        if (error) {
                                            handleError(error);
                                        } else {
                                            imapClient.end();
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            })
        })
        imapClient.connect();
      } catch (error) {
        console.error(error);
      }
}