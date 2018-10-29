import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProcesslistComponent } from './processlist/processlist.component';
import { StartProcessComponent } from './start-process/start-process.component'
import { TasklistComponent } from './tasklist/tasklist.component';
import { FormioDummyComponent } from './formio-dummy/formio-dummy.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'processlist', component: ProcesslistComponent },
  { path: 'startprocess/:processdefinitionkey', component: StartProcessComponent },
  { path: 'tasklist', component: TasklistComponent },
  { path: 'tasklist/:id', component: TasklistComponent },
  { path: 'dummyform', component: FormioDummyComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
