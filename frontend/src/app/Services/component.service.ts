import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ComponentService{
  private actualComponent : string = "";
  time: boolean = false;

  setTime(time:boolean){
    this.time = time;
  }

  getTime(){
    return this.time;
  }

  setComponent(component: string){
    this.actualComponent = component;
  }

  getComponent(){
    return this.actualComponent;
  }
}
