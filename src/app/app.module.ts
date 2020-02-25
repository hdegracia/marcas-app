import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { MarcasComponent } from './marcas/marcas.component';
import { FormComponent } from './marcas/form.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-PA';
import { Routes, RouterModule } from '@angular/router';
import { MarcasService } from './marcas/marcas.service';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './marcas/detalle/detalle.component';

registerLocaleData(localeEs, 'es');

const routes: Routes = [
  {path: '',redirectTo: '/marcas', pathMatch: 'full'},
  {path: 'marcas', component: MarcasComponent},
  {path: 'marcas/page/:page', component: MarcasComponent},  
  {path: 'marcas/form', component: FormComponent},
  {path: 'marcas/form/:id', component: FormComponent}
] 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MarcasComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [MarcasService, {provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
