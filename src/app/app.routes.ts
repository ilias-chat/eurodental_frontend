import { Routes } from '@angular/router';
import { ClientsComponent } from './main-content/clients/clients.component';
import { InvoicesComponent } from './main-content/invoices/invoices.component';
import { HomeComponent } from './main-content/home/home.component';
import { ProductsComponent } from './main-content/products/products.component';
import { TasksComponent } from './main-content/tasks/tasks.component';
import { UsersComponent } from './main-content/users/users.component';

export const routes: Routes = [
    {
        path:'dashboard',
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
    {
        path:'tasks',
        component: TasksComponent,
    },
    {
        path:'users',
        component: UsersComponent,
    },
];
