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
        //     console.log('no no no');
        //     return null;
        // }
        return this._access_token;
    }

    public get refresh_token() {
        // if(!this._access_token_expiration_date || new Date() > this._access_token_expiration_date){
        //     return null;
        // }
        return this._refresh_token;
    }

    public get expires_in() {
        // if(!this._access_token_expiration_date || new Date() > this._access_token_expiration_date){
        //     console.log('no no no');
        //     return null;
        // }
        return this._access_token_expiration_date;
    }
    
}