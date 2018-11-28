import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CamundaRestService } from '../camunda-rest.service';
import { Task } from '../schemas/Task';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  tasks: Task[] = null;
  activeTask: any = null;
  taskId: String;
  formKey: String;

  constructor(
    private camundaRestService: CamundaRestService,
    private keycloakAngular: KeycloakService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    //this.getTasks();
    if (this.route.params != null) {
      this.route.params.subscribe(params => {
        if (params['id'] != null) {
          this.taskId = params['id'];
           
          this.activeTask=this.camundaRestService
            .getTaskById(this.taskId);
          /*
          this.camundaRestService
            .getTaskById(this.taskId)
            .subscribe(task => this.activeTask = task);*/
          //this.getFormKey();
        } else {
          this.getTasks();
        }
      });
    }
  }
  
  claimTask(taskId: String):void{
      
      let body = {"userId": this.keycloakAngular.getUsername()};
      console.log('claiming task')
      this.camundaRestService
            .claimTask(taskId,body)
            .subscribe(result => {
                this.activeTask=this.camundaRestService
                    .getTaskById(taskId);
            });
  }
  

  getFormKey(): void {
    this.camundaRestService
      .getTaskFormKey(this.taskId)
      .subscribe(formKey => this.formKey = formKey.key);
  }

  getTasks(): void {
    this.camundaRestService
      .getTasks()
      .subscribe(tasks => this.tasks = tasks);
  }

}
