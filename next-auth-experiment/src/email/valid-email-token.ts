import IsCodeMatches from "./is-code-matches";
import IsEmailToken from "./is-email-token";

const texts = {
  codeMatchesMessage: "O código está incorreto",
};

export default class ValidEmailToken {
  @IsCodeMatches("token", {
    message: () => texts.codeMatchesMessage,
  })
  code!: string;

  @IsEmailToken()
  token!: string;
}
