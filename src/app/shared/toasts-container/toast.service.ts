import { Injectable,signal } from "@angular/core";
import { Toast } from "./toast.model";

@Injectable({
    providedIn:'root'
})
export class ToastsService{
    //toasts = signal<Toast[]>([]);
    toasts:Toast[] = [];

    interval_id:number = -1;

    remove(code:string){ 
        let index= -1;

        for (let i = 0; i < this.toasts.length; i++) {
            if(this.toasts[i].code === code)
            index = i;
        }

        this.toasts.splice(index, 1);

        if(this.toasts.length == 0){
            if(this.interval_id != -1){
                clearInterval(this.interval_id);
                this.interval_id = -1;
            }
        }

        console.log(this.toasts);
    }

    add(message:string, type:string){
        const code = Date.now().toString(36);
        this.toasts.push({
          code: code,
          message:message,
          type:type,
        });

        if (this.interval_id == -1){
            this.interval_id = window.setInterval(()=>{
                this.remove(code);
            }, 3000);
        }
    }

    get_all(){
        return this.toasts;
    }
}