export class ClientModel {
  id: number;
  name: string;
  username: string;

  constructor(id: number, name: string, username: string) {
    this.id = id;
    this.name = name;
    this.username = username;
  }
}

export class ClientModelRequest {
  name: string;
  username: string;

  constructor(name: string, username: string) {
    this.name = name;
    this.username = username;
  }
}
