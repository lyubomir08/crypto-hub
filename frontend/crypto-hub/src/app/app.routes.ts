import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './error/error.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { CatalogComponent } from './cryptos/catalog/catalog.component';
import { AddCryptoComponent } from './cryptos/add-crypto/add-crypto.component';
import { ErrorMsgComponent } from './core/error-msg/error-msg.component';
import { SearchCryptoComponent } from './cryptos/search-crypto/search-crypto.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    {
        path: 'cryptos', children: [
            { path: '', component: CatalogComponent },
            {
                path: 'create', loadComponent: () =>
                    import('./cryptos/add-crypto/add-crypto.component').then((c) => c.AddCryptoComponent),
            },
        ]
    },
    {path: 'search', component: SearchCryptoComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'error', component: ErrorMsgComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
