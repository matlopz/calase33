const { userMail } = require("../config");
const transport = require("../utils/nodemailer");
const UsuarioRepository = require("../repositories/UsuarioRepository");
const usuarioRepository = new UsuarioRepository()

class MailAdapter {
    async sendMessage(messageInfo) {
        await transport.sendMail({
            from: userMail,
            to: messageInfo.email,
            subject: `${messageInfo.name} Bienvenido a nuestro sitio!!!`,
            html: `
                <div>
                    <h1>Hola ${messageInfo.lastname}, es un gusto tenerte con nosotros</h1>
                </div>
            `,
        });
    }
    async sendDeletedProduct(messageInfo) {
        await transport.sendMail({
            from: userMail,
            to: messageInfo.email,
            subject: `${messageInfo.name} Productos Eliminado`,
            html: `
                <div>
                    <h1>Hola ${messageInfo.lastname}, el producto eliminado es ID: ${messageInfo.id} titulo: ${messageInfo.productName}</h1>
                </div>
            `,
        });
    }
    async sendPasswordResetEmail(messageInfo) {
        const resetToken = messageInfo.resetToken
        await usuarioRepository.addPasswordResetToken(messageInfo.email, resetToken);
        const resetLink = `http://localhost:8080/reset-password/${resetToken}`;
        await transport.sendMail({
            from: userMail,
            to: messageInfo.email,
            subject: 'Recuperación de Contraseña',
            html: `
                <div>
                    <h1>Hola ${messageInfo.lastname},</h1>
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${resetLink}">Restablecer Contraseña</a>
                </div>
            `,
        });
    }


}


module.exports = MailAdapter;
