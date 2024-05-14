import { Mail } from "@egvelho/next-utils/server";

const texts = {
  emailVerificationSubject: "Verificar email",
  emailVerificationContent: (code: string) =>
    `Utilize o seguinte **código** para verificar seu email:\n**${code}**`,
};

export default async function emailVerification(email: string, code: string) {
  const success = await Mail.send({
    to: email,
    subject: texts.emailVerificationSubject,
    markdown: texts.emailVerificationContent(code),
  });

  return success;
}
