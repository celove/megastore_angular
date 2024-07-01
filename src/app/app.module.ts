import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [LoginComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter,
                allowedDomains: ['localhost:8080'],
                disallowedRoutes: ['localhost:8080/auth/login']
            }
        }),
        FormsModule
    ],
    providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: []
})
export class AppModule { }
