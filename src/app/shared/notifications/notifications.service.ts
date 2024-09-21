import { Injectable } from "@angular/core";
import { My_notification } from "./my_notification.model";

@Injectable({
    providedIn:'root'
})
export class NotificationsService{

    getRandomDate() {
        const start = new Date(0).getTime();
        const end = Date.now();
        const randomTimestamp = Math.floor(Math.random() * (end - start + 1)) + start;
        const randomDate = new Date(randomTimestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          };
        return randomDate.toLocaleDateString('en-US', options);
    }

    all(){
        return [
            {
                id:1,
                title:'notification 01',
                icon:'https://via.placeholder.com/36',
                description:'description for notification 01',
                creation_time: this.getRandomDate(),
                seen:true,
            },
            {
                id:2,
                title:'notification 02',
                icon:'https://via.placeholder.com/36',
                description:'description for notification 02',
                creation_time:  this.getRandomDate(),
                seen:true,
            },
            {
                id:3,
                title:'notification 03',
                icon:'https://via.placeholder.com/36',
                description:'description for notification 03',
                creation_time:  this.getRandomDate(),
                seen:true,
            },
            {
                id:4,
                title:'notification 04',
                icon:'https://via.placeholder.com/36',
                description:'description for notification 04',
                creation_time:  this.getRandomDate(),
                seen:true,
            }
        ];
    }
}