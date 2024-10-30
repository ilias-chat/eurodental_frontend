import { Injectable } from "@angular/core";
import { Toast } from "./toast.model";

@Injectable({
    providedIn:'root'
})
export class ToastsService{

    toasts:Toast[] = [];
    toast_life_time:number = 4;

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
    }

    add(message:string, type:string){
        const now:Date = new Date();
        this.toasts.push({
          code: Date.now().toString(36),
          message:message,
          type:type,
          time_created:now.getSeconds(),
          time_to_be_distroyed:this.add_seconds(now.getSeconds(),this.toast_life_time),
        });


        if (this.interval_id == -1){
            this.interval_id = window.setInterval(()=>{

                for (let i = 0; i < this.toasts.length; i++) {
                    this.toasts[i].time_created = this.add_seconds(this.toasts[i].time_created,1);
                    if(this.toasts[i].time_created === this.toasts[i].time_to_be_distroyed){
                        this.toasts.splice(i, 1);
                        break;
                    }
                }

                if(this.toasts.length === 0){
                    if(this.interval_id !== -1){
                        clearInterval(this.interval_id);
                        this.interval_id = -1;
                        console.log('removed');
                    }
                }
            }, 1000);
        }
    }

    add_seconds(seconds:number, number_to_add:number){
        for (let i = 0; i < number_to_add; i++) {
            seconds++;
            if(seconds > 60)
                seconds = 1
        }
        return seconds;
    }

    get_all(){
        return this.toasts;
    }
}