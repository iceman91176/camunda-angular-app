import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CamundaRestService } from './camunda-rest.service';
import { FormioService } from './formio.service';

import { ProcesslistComponent } from './processlist/processlist.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { HomeComponent } from './home/home.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { GenericForm } from './generic-form.component';
import { MyAddonModule } from './forms/myprocess/myAddon.module';
import { FormioModule, FormioAppConfig } from 'angular-formio';
import { FormioDummyComponent } from './formio-dummy/formio-dummy.component';
import { FormioStartComponent } from './forms/formio-start/formio-start.component';
import { FormioUsertaskComponent } from './forms/formio-usertask/formio-usertask.component';
import {AppConfig} from './formio-config';

import { ClarityModule } from '@clr/angular';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppAuthGuard } from './app.authguard';
import { initializer } from './utils/app-init';

@NgModule({
  declarations: [
    AppComponent,
    ProcesslistComponent,
    TasklistComponent,
    HomeComponent,
    StartProcessComponent,
    GenericForm,
    FormioDummyComponent,
    FormioStartComponent,
    FormioUsertaskComponent
  ],
  imports: [
    FormsModule,
    SuiModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MyAddonModule,
    ClarityModule.forRoot(),
    KeycloakAngularModule,
    FormioModule
  ],
  providers: [CamundaRestService,FormioService,{provide: FormioAppConfig, useValue: AppConfig},{
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
