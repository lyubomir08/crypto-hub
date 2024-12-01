import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './error/error.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { CatalogComponent } from './cryptos/catalog/catalog.component';
import { AddCryptoComponent } from './cryptos/add-crypto/add-crypto.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    { path: 'cryptos', children: [
        {path: '', component: CatalogComponent},
        {path: 'create', component: AddCryptoComponent}
    ] },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '404', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/404', pathMatch: 'full'},
];
