export interface Product{
    id:number,
	product_name:string,
    image_path:string,
	brand:string,
	id_categorie:number,
	categorie:string,
	id_sub_categorie:number,
	sub_categorie:string,
	price:number,
	stock_quantity:number,
	has_warranty:boolean ,
	warranty_duration_months:number,
	purshase_date:string,
    description:string,
}