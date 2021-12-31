export class ProjectModel {
  id: number;
  name: string;
  username: string;
  client: number | null;
  clientName: string = "";

  constructor(id: number, name: string, username: string, client: number | null) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.client = client;
  }
}
export class ProjectModelRequest {
  name: string;
  username: string;
  client: number | null;

  constructor(name: string, username: string, client: number | null) {
    this.name = name;
    this.username = username;
    this.client = client;
  }
}
