import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './error/error.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { CatalogComponent } from './cryptos/catalog/catalog.component';
import { AddCryptoComponent } from './cryptos/add-crypto/add-crypto.component';
import { SearchCryptoComponent } from './cryptos/search-crypto/search-crypto.component';
import { DetailedCryptoComponent } from './cryptos/detailed-crypto/detailed-crypto.component';
import { EditCryptoComponent } from './cryptos/edit-crypto/edit-crypto.component';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/loggedIn.guard';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    {
        path: 'cryptos', children: [
            { path: '', component: CatalogComponent },
            {path: ':cryptoId/details', component: DetailedCryptoComponent},
            {
                path: 'create', loadComponent: () =>
                    import('./cryptos/add-crypto/add-crypto.component').then((c) => c.AddCryptoComponent),
                canActivate: [AuthGuard]
            },
            {path: ':cryptoId/edit', component: EditCryptoComponent, canActivate: [AuthGuard] },
        ]
    },
    {path: 'search', component: SearchCryptoComponent},
    {path: 'profile', component: ProfileComponent},
    { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
