export class ProjectModel {
  id: number;
  name: string;
  user: number;
  client: number;

  clientName: string = "";

  constructor(id: number, name: string, user: number, client: number) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.client = client;
  }
}
export class ProjectModelRequest {
  name: string;
  user: number;
  client: number;

  constructor(name: string, user: number, client: number) {
    this.name = name;
    this.user = user;
    this.client = client;
  }
}
