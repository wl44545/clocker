export class TimeEntryModel {
  id: number;
  description: string;
  username: string;
  start: Date;
  stop: Date;
  project: number;

  constructor(id: number, description: string, username: string, start: Date, stop: Date, project: number) {
    this.id = id;
    this.description = description;
    this.username = username;
    this.start = start;
    this.stop = stop;
    this.project = project;
  }
}
export class TimeEntryModelRequest {
  description: string;
  username: string;
  start: Date;
  stop: Date;
  project: number;

  constructor(description: string, username: string, start: Date, stop: Date, project: number) {
    this.description = description;
    this.username = username;
    this.start = start;
    this.stop = stop;
    this.project = project;
  }
}
