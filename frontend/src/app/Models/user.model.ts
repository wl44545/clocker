import {stringify} from "@angular/compiler/src/util";

export class UserModel {
  id: number;
  username: string;
  role: string;
  password: string;

  constructor(id:number, username: string, role: string, password: string) {
    this.username = username;
    this.role = role;
    this.password = password;
    this.id = id;
  }
}

export class UserModelRequest{
  username: string;
  role: string;
  password: string;

  constructor(username: string, role: string, password: string) {
    this.username = username;
    this.role = role;
    this.password = password;
  }
}
