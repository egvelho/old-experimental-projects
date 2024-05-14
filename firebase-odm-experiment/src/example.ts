import {
  Node,
  IsNotEmpty,
  IsString,
  Read,
  Write,
  Child,
  IndexOn,
  request,
} from "./index";

@Node("$uid")
class User {
  @IsNotEmpty()
  @IsString({ message: "teste 1" })
  teste!: string;

  @IsNotEmpty()
  @IsString()
  teste2?: string;
}

@Node("users")
class Users {
  @Read()
  @Write()
  @Child(User)
  $uid!: User;
}

@Node("rules")
class Rules {
  @Child(Users)
  @Read()
  @Write()
  @IndexOn(["teste"])
  users!: Users;
}

const rules = new Rules();

export default rules;
