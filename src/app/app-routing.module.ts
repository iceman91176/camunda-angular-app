import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppAuthGuard } from './app.authguard';

import { HomeComponent } from './home/home.component';
import { ProcesslistComponent } from './processlist/processlist.component';
import { StartProcessComponent } from './start-process/start-process.component'
import { TasklistComponent } from './tasklist/tasklist.component';
import { FormioDummyComponent } from './formio-dummy/formio-dummy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent,canActivate: [AppAuthGuard] },
  { path: 'processlist', component: ProcesslistComponent ,canActivate: [AppAuthGuard],data: {
      roles: ['admin','user']
    }},
  { path: 'startprocess/:processdefinitionkey', component: StartProcessComponent ,canActivate: [AppAuthGuard]},
  { path: 'tasklist', component: TasklistComponent ,canActivate: [AppAuthGuard]},
  { path: 'tasklist/:id', component: TasklistComponent ,canActivate: [AppAuthGuard]},
  { path: 'dummyform', component: FormioDummyComponent ,canActivate: [AppAuthGuard],data: {
      roles: ['admin']
    } },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AppAuthGuard]
})
export class AppRoutingModule { }
