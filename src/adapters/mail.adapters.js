
const { userMail } = require("../config");
const transport = require("../utils/nodemailer");

class MailAdapter {
    async sendMessage(messageInfo) {
        await transport.sendMail({
            from:userMail,
            to: messageInfo.email, // Corregido: Acceder a messageInfo.email en lugar de newUser.email
            subject: `${messageInfo.name} Bienvenido a nuestro sitio!!!`,
            html: `
                <div>
                    <h1>Hola ${messageInfo.lastname}, es un gusto tenerte con nosotros</h1>
                </div>
            `,
        });
    }
}

module.exports = MailAdapter;

