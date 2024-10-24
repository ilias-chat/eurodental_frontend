export class Current_user{
    constructor(
        public id: number,
        public email: string,
        public first_name: string,
        public last_name: string,
        public image_path:string,
        public profile: string,
        public profile_id: number,
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
        return this._refresh_token;
    }

    public get expires_in() {
        return this._access_token_expiration_date;
    }
    
}