export interface Product{
    id:number,
	product_name:string,
    image_path:string,
	id_category:number,
	category_name:string,
	id_sub_category:number,
	sub_category_name:string,
	id_brand:number,
	brand_name:string,
	price:number|undefined,
	stock_quantity:number|undefined,
	has_warranty:boolean ,
	warranty_duration_months:number|undefined,
    description:string,
	reference:string,
	image_id:number,
}