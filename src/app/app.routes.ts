import { Routes } from '@angular/router';
import { InvoicesComponent } from './app-content/main/invoices/invoices.component';
import { HomeComponent } from './app-content/main/home/home.component';
import { ClientsComponent } from './app-content/main/clients/clients.component';
import { ProductsComponent } from './app-content/main/products/products.component';
import { TasksComponent } from './app-content/main/tasks/tasks.component';
import { UsersComponent } from './app-content/main/users/users.component';
import { LoginComponent } from './authentification/login/login.component';
import { AppContentComponent } from './app-content/app-content.component';
import { Auth_guard } from './authentification/auth.guard';

export const routes: Routes = [
    {
        path:'login',
        component: LoginComponent,
    },
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path:'app',
        component: AppContentComponent,
        canActivate: [Auth_guard],
        children: [
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
        ]
    },
];
