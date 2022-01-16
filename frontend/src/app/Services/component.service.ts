import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ComponentService{
  private actualComponent : string = "";

  setComponent(component: string){
    this.actualComponent = component;
  }

  getComponent(){
    return this.actualComponent;
  }
}
