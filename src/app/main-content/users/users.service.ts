import { Injectable,inject,signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "./user.model";

@Injectable({
    providedIn:'root'
})
export class UsersService {
  private users = signal<User[]>([]);
  all_users = this.users.asReadonly();

  private http = inject(HttpClient);
  private api_url = 'http://35.180.66.24';
  
  public set set_users(users:User[]) {
    this.users.set(users);
  }

  all():Observable<User[]>{
    return this.http.get<User[]>('http://35.180.66.24/users');
  }

  filter(name:string, profile:string){
    if(name != '' && profile != ''){
      return this.users().filter((user)=>{
        return (user.first_name.toLowerCase().includes(name) || user.last_name.toLowerCase().includes(name))
          && user.profile.toLowerCase() === profile.toLowerCase();
      });
    } else if (name != ''){
      return this.users().filter((user)=>{
        return (user.first_name.toLowerCase().includes(name) || user.last_name.toLowerCase().includes(name));
      });
    } else if (profile != ''){
      return this.users().filter((user)=>{
        return user.profile.toLowerCase() === profile.toLowerCase();
      });
    }
    else return this.users();
  }

  add(user:FormData):Observable<Object>{
    return this.http.post(this.api_url + '/users', user);
  }

  edit(user:FormData, user_id:number):Observable<Object>{
    return this.http.put(this.api_url+'/users/'+user_id, user);
  }
  
  public set add_user(user:User) {
    this.users.set([...this.users(), user]);
  }

  public set edit_user(user:User) {
     this.users.set(
      this.users().map((cl) => {
        if (cl.id === user.id) {
          return user;
        }
        return cl;
      })
    ); 
  }
  

}