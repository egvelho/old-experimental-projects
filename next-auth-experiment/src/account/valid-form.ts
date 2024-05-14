import { IsString } from "class-validator";
import ValidUser from "../user/valid-user";

export default class ValidForm extends ValidUser {
  @IsString()
  code!: string;

  @IsString()
  token!: string;
}
