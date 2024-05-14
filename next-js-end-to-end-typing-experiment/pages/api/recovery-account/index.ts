import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import User from "@app/user/user.entity";
import JWT from "@app/jwt";
import mail from "@app/mail";

export interface RecoveryCodePayload {
    email: string;
    code: string;
}

const content = (code: string) => `
Utilize o seguinte **código** para recuperar a sua conta:

${code}

Você recebeu este email porque um pedido de recuperação de conta foi realizado.
Caso você não tenha executado esta operação, é seguro simplesmente ignorar este email.
`;

export default endpoint(__filename, {
    post: validate({
        async method({ email }) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const token = JWT.encode({ email, code } as RecoveryCodePayload, {
                expiresIn: "1h",
            });

            email &&
                mail.send({
                    to: email,
                    subject: "Recuperar sua conta",
                    markdown: content(code),
                });

            return token;
        },
        inputType: User,
        groups: ["recovery-account"],
    }),
});
