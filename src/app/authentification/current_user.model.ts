export class Current_user{
    constructor(
        public id: number,
        public email: string,
        private _access_token:string,
        private _access_token_expiration_date: Date,
        private _refresh_token:string,
    ) {}

    
    public get access_token() {
        // if(!this._access_token_expiration_date || new Date() > this._access_token_expiration_date){
        //     return null;
        // }
        return this._access_token;
    }
    
}