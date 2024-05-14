import NodeMailer from "nodemailer";
import MarkdownIt from "markdown-it";
import config from "@app/config";

const markdownIt: MarkdownIt =
    typeof window === "undefined"
        ? new MarkdownIt({
              breaks: true,
              linkify: true,
          })
        : (undefined as any);

export default class Mail {
    static async send({
        to,
        subject,
        markdown,
    }: {
        to: string;
        subject: string;
        markdown: string;
    }) {
        const smtp = NodeMailer.createTransport({
            host: config().mail.host,
            port: 465,
            secure: true,
            auth: {
                user: config().mail.user,
                pass: config().mail.password,
            },
        });

        const success: boolean = await new Promise((resolve) => {
            smtp.sendMail(
                {
                    from: config().mail.user,
                    to,
                    subject,
                    html: markdownIt.render(markdown),
                },
                (error, response) => resolve(!error),
            );
        });

        return success;
    }
}
