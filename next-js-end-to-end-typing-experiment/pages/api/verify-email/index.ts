import endpoint from "@app/http/endpoint";
import validate from "@app/http/middleware/validate";
import JWT from "@app/jwt";
import mail from "@app/mail";
import User from "@app/user/user.entity";

export interface VerifyCodePayload {
    email: string;
    code: string;
}

const content = (code: string) => `
Utilize o seguinte **código** para verificar seu email:

${code}
`;

export default endpoint(__filename, {
    post: validate({
        async method({ email }) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const token = JWT.encode({ email, code } as VerifyCodePayload, {
                expiresIn: "1h",
            });

            email &&
                mail.send({
                    to: email,
                    subject: "Verificar seu email",
                    markdown: content(code),
                });

            return token;
        },
        inputType: User,
        groups: ["verify-email"],
    }),
});
