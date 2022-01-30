export class TimeEntryModel {
  id: number;
  description: string;
  user: number;
  start: Date;
  stop: Date;
  project: number;
  client: number = 0;
  active: boolean = false;

  projectName: string = "";
  clientName: string = "";
  timeDiff: string = "";


  constructor(id: number, description: string, user: number, start: Date, stop: Date, project: number, active: boolean) {
    this.id = id;
    this.description = description;
    this.user = user;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}
export class TimeEntryModelRequest {
  description: string;
  user: number;
  start: Date|string;
  stop: Date | null|string;
  project: number;
  active: boolean;

  constructor(description: string, user: number, start: Date|string, stop: Date | null|string, project: number, active: boolean) {
    this.description = description;
    this.user = user;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}

export class TimeLocalModelRequest{
  description: string;
  user: number;
  start: string;
  stop: string;
  project: number;
  client: number = 0;
  projectName: string = "";
  clientName: string = "";
  timeDiff: string = "";
  active: boolean = false;

  constructor(description: string, user: number, start: string, stop: string, project: number, active: boolean) {
    this.description = description;
    this.user = user;
    this.start = start;
    this.stop = stop;
    this.project = project;
    this.active = active;
  }
}
