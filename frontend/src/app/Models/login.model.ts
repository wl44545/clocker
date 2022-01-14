export class LoginRequestModel {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class LoginResponseModel {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
