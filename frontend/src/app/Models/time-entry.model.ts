export class TimeEntryModel {
  id: number;
  description: string;
  username: string;
  start: Date;
  stop: Date;
  project: number;

  client: number = 0;
  projectName: string = "";
  clientName: string = "";
  timeDiff: string = "";
  active: boolean = false;

  constructor(id: number, description: string, username: string, start: Date, stop: Date, project: number, active: boolean) {
    this.id = id;
    this.description = description;
    this.username = username;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}
export class TimeEntryModelRequest {
  description: string;
  username: string;
  start: Date;
  stop: Date | null;
  project: number;
  active: boolean;

  constructor(description: string, username: string, start: Date, stop: Date | null, project: number, active: boolean) {
    this.description = description;
    this.username = username;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}

export class TimeLocalModelRequest{
  description: string;
  username: string;
  start: string;
  stop: string;
  project: number;
  client: number = 0;
  projectName: string = "";
  clientName: string = "";
  timeDiff: string = "";
  active: boolean = false;

  constructor(description: string, username: string, start: string, stop: string, project: number, active: boolean) {
    this.description = description;
    this.username = username;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}
