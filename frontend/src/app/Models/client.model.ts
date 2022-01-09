export class ClientModel {
  id: number;
  name: string;
  user: number;

  constructor(id: number, name: string, user: number) {
    this.id = id;
    this.name = name;
    this.user = user;
  }
}
export class ClientModelRequest {
  name: string;
  user: number;

  constructor(name: string, user: number) {
    this.name = name;
    this.user = user;
  }
}
