import { IsString } from "class-validator";
import IsAuthenticated from "./is-authenticated";

export default class ValidToken {
  @IsString()
  @IsAuthenticated()
  token!: string;
}
