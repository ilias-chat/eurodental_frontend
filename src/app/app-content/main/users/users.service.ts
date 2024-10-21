import { Injectable,inject,signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, tap } from "rxjs";
import { User } from "./user.model";
import { HttpService } from "../../../shared/http.service";

@Injectable({
    providedIn:'root'
})
export class UsersService {
  private users = signal<User[]>([]);
  all_users = this.users.asReadonly();

  private http = inject(HttpClient);
  private http_service = inject(HttpService);
  private api_url = this.http_service.api_url + '/users';
  
  public set set_users(users:User[]) {
    this.users.set(users);
  }

  all():Observable<User[]>{
    return this.http.get<User[]>(this.api_url).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  filter(name:string, profile:string){
    if(name != '' && profile != ''){
      return this.users().filter((user)=>{
        return (user.first_name.toLowerCase().includes(name) || user.last_name.toLowerCase().includes(name))
          && user.profile_id === Number(profile);
      });
    } else if (name != ''){
      return this.users().filter((user)=>{
        return (user.first_name.toLowerCase().includes(name) || user.last_name.toLowerCase().includes(name));
      });
    } else if (profile != ''){
      return this.users().filter((user)=>{
        return user.profile_id === Number(profile);
      });
    }
    else return this.users();
  }

  add(user:FormData):Observable<Object>{
    user.append('password', this.generatePassword());
    return this.http.post(this.api_url, user).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  edit(user:FormData, user_id:number):Observable<Object>{
    return this.http.put(this.api_url + '/' + user_id, user).pipe(
      catchError(this.http_service.handle_error)
    );
  }

  block_users(data:{user_ids:number[]}):Observable<Object>{
    return this.http.post(this.api_url + '/block_users', data).pipe(
      catchError(this.http_service.handle_error),
      tap(()=>{
        this.users().map((user)=>{
          if(data.user_ids.includes(user.id)){
            user.is_blocked = true;
          }
        });
      })
    );
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
  
  private generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
  
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
  }
}