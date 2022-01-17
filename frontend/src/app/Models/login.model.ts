import {Md5} from "ts-md5";

export class LoginRequestModel {
  username: string;
  password: string;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = LoginSecurity.getHash(password);
  }
}

export class LoginResponseModel {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
}

export class LoginSecurity{
  public static getHash(input: string): string{
    const md5 = new Md5();
    return md5.appendStr(input).end().toString();
  }
}
