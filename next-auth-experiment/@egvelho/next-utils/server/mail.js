"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const markdown_it_1 = tslib_1.__importDefault(require("markdown-it"));
const markdownIt = new markdown_it_1.default({
    breaks: true,
    linkify: true,
});
function send({ to, subject, markdown, }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const smtp = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 465,
            secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : true,
            requireTLS: process.env.MAIL_REQUIRE_TLS
                ? process.env.MAIL_REQUIRE_TLS === "true"
                : true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        const success = yield new Promise((resolve) => {
            var _a;
            smtp.sendMail({
                from: (_a = process.env.MAIL_FROM) !== null && _a !== void 0 ? _a : process.env.MAIL_USER,
                to,
                subject,
                html: markdownIt.render(markdown),
            }, (error, response) => resolve(!error));
        });
        return success;
    });
}
class Mail {
}
exports.Mail = Mail;
Mail.send = send;
//# sourceMappingURL=mail.js.map