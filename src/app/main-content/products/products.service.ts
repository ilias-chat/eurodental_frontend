import { Injectable,signal } from "@angular/core";
import { Product } from "./product.model";

@Injectable({
    providedIn:'root'
})
export class ProductsService{
    private products = signal<Product[]>([]);
    all_products = this.products.asReadonly();

    constructor(){
      this.products.set(this.all());
    }

    all():Product[]{
        return [
            {
                id: 1,
                product_name: "Laptop",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand A",
                id_categorie: 101,
                categorie: "Electronics",
                id_sub_categorie: 201,
                sub_categorie: "Computers",
                price: 999.99,
                stock_quantity: 10,
                has_warranty: true,
                warranty_duration_months: 24,
                purshase_date: "2024-09-01",
                description:'',
            },
            {
                id: 2,
                product_name: "Smartphone",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand B",
                id_categorie: 102,
                categorie: "Electronics",
                id_sub_categorie: 202,
                sub_categorie: "Mobile Phones",
                price: 699.99,
                stock_quantity: 25,
                has_warranty: true,
                warranty_duration_months: 12,
                purshase_date: "2024-09-15",
                description:'',
            },
            {
                id: 3,
                product_name: "Headphones",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand C",
                id_categorie: 103,
                categorie: "Electronics",
                id_sub_categorie: 203,
                sub_categorie: "Audio",
                price: 199.99,
                stock_quantity: 50,
                has_warranty: false,
                warranty_duration_months: 0,
                purshase_date: "2024-08-10",
                description:'',
            },
            {
                id: 4,
                product_name: "Smartwatch",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand D",
                id_categorie: 104,
                categorie: "Electronics",
                id_sub_categorie: 204,
                sub_categorie: "Wearables",
                price: 249.99,
                stock_quantity: 30,
                has_warranty: true,
                warranty_duration_months: 18,
                purshase_date: "2024-07-05",
                description:'',
            },
            {
                id: 5,
                product_name: "Bluetooth Speaker",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand E",
                id_categorie: 105,
                categorie: "Electronics",
                id_sub_categorie: 205,
                sub_categorie: "Audio",
                price: 89.99,
                stock_quantity: 100,
                has_warranty: true,
                warranty_duration_months: 12,
                purshase_date: "2024-06-20",
                description:'',
            },
            {
                id: 6,
                product_name: "Gaming Console",
                image_path: "https://via.placeholder.com/150",
                brand: "Brand F",
                id_categorie: 106,
                categorie: "Electronics",
                id_sub_categorie: 206,
                sub_categorie: "Gaming",
                price: 499.99,
                stock_quantity: 15,
                has_warranty: true,
                warranty_duration_months: 24,
                purshase_date: "2024-05-25",
                description:'',
            }
        ];
        
    }

    filter(name:string, brand:string){
        if(name != '' && brand != ''){
          return this.products().filter((product)=>{
            return (product.product_name.toLowerCase().includes(name))
              && product.brand.toLowerCase() === brand.toLowerCase();
          });
        } else if (name != ''){
          return this.products().filter((product)=>{
            return (product.product_name.toLowerCase().includes(name));
          });
        } else if (brand != ''){
          return this.products().filter((product)=>{
            return product.brand.toLowerCase() === brand.toLowerCase();
          });
        }
        else return this.products();
      }

    add(product:Product){
        product.id = this.products().length + 1;
        this.products.set([...this.products(),product]);
        return product.id;
    }
    
    edit(product:Product){
    this.products.set(
        this.products().map((pr) => {
        if (pr.id === product.id) {
            return product;
        }
        return pr;
        })
    ); 
    }
}