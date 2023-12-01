const { userMail } = require("../config");
const transport = require("../utils/nodemailer");
const { v4: uuidv4 } = require('uuid');

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

    async sendPasswordResetEmail(messageInfo) {
        // Generar un token único para la recuperación de contraseña
        const resetToken = messageInfo.resetToken

        // Agregar el token y la expiración al usuario en la base de datos
        await usuarioRepository.addPasswordResetToken(messageInfo.email, resetToken);

        const resetLink = `http://localhost:8080/reset-password/${resetToken}`;

        // Enviar el correo de recuperación de contraseña
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

// Exportar la instancia de MailAdapter
module.exports = MailAdapter;
