export class ProjectModel {
  id: number;
  name: string;
  username: string;
  client: number;
  clientName: string = "";

  constructor(id: number, name: string, username: string, client: number) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.client = client;
  }
}
export class ProjectModelRequest {
  name: string;
  username: string;
  client: number;

  constructor(name: string, username: string, client: number) {
    this.name = name;
    this.username = username;
    this.client = client;
  }
}
