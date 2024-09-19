import { Routes } from '@angular/router';
import { ClientsComponent } from './main-content/clients/clients.component';
import { InvoicesComponent } from './main-content/invoices/invoices.component';
import { HomeComponent } from './main-content/home/home.component';
import { ProductsComponent } from './main-content/products/products.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent,
    },
    {
        path:'clients',
        component: ClientsComponent,
    },
    {
        path:'invoices',
        component: InvoicesComponent,
    },
    {
        path:'products',
        component: ProductsComponent,
    },
];
