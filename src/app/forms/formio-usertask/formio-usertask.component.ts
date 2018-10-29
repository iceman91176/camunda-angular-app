import { Component, OnInit,OnChanges, SimpleChange, Input,EventEmitter } from '@angular/core';

import { CamundaRestService } from '../../camunda-rest.service';
import { FormioService } from '../../formio.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'formio-user-form',
  templateUrl: './formio-usertask.component.html',
  styleUrls: ['./formio-usertask.component.css']
})
export class FormioUsertaskComponent implements OnChanges {

  @Input() taskId:String = null;
  private refreshForm: EventEmitter<object>;
  private formReadOnly: boolean = false;
  private formKey:String=null;
  private formDefinition: any = null;
  private formDefinitionLoaded: boolean = false;
  private formData: any={data:{vorname:'bla'}};
  private camundaFormModel: any = null;
  private submitted : boolean = false;

  private formComponents:any;
  //private router: Router;


  constructor(
    private camundaRestService: CamundaRestService,
    private formIOService: FormioService,
  private router: Router) {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.refreshForm = new EventEmitter();

    for (let propName in changes) {
      console.log(propName);
      if (propName === 'taskId' && changes[propName].currentValue != null) {
        console.log(changes[propName].currentValue);
        this.taskId = changes[propName].currentValue;
        this.loadFormKey();
        //this.loadForm(changes[propName].currentValue);
      }
    }
  }

  loadFormIOFormDefinition(formKey:String):void{
    this.formIOService.getFormDefinition(formKey)
      .subscribe(formDefinition => {
        this.formDefinition = formDefinition;
        this.formComponents = this.formIOService.getComponents(formDefinition);
        this.populateFormVariablesFromTask(this.formComponents );

        this.camundaRestService.getVariablesForTask(this.taskId,this.getFormVariableNamesForTask().join()).subscribe((result) => {
          this.camundaFormModel = result;
          //console.log(result);
        });


    });
  }

  generateVariablesFromSubmission(submissionData) {
    const variables = {
      variables: { }
    };
    Object.keys(this.camundaFormModel).forEach((field) => {
      //console.log('Looking for CamundaFormField ' + field + ' in formio submission');
      if (submissionData[field]!==null && submissionData[field]!==undefined){
        variables.variables[field] = {
          value: submissionData[field]
        };
      }
    });
    return variables;
  }

  populateFormVariablesFromTask(formComponents:any):void{
      const bpmTaskVarPrefix:String = "ds[bpm].task.variable.";
      const submissionData: any={data:{}};
      //Alle Components ermitteln die als DefautValue das bpmTaskVarPrefix haben
      let componentsToPopulate = formComponents.filter(function (component) {
        if ("defaultValue" in component){
          if (typeof(component.defaultValue) === 'string' || component.defaultValue instanceof String){
            if (component.defaultValue.indexOf(bpmTaskVarPrefix) !== -1){
              return component;
            }
          }
        }
      });

      if (componentsToPopulate.length > 0){
        //Daraus ein Mapping BPM Taskvariablennamen -> Component-Key erstellen
        let variablesToFetchMap = componentsToPopulate.reduce(function(accum, component) {
          const varName = component.defaultValue.substr(bpmTaskVarPrefix.length);
          accum[varName] = component.key;
          return accum;
        }, {});

        let varNames = Object.keys(variablesToFetchMap);
        //Die erforderlichen Variablen aus BPM auslesen
        this.camundaRestService.getVariablesForTask(this.taskId,varNames.join()).subscribe((result) => {
          //Wert der ermittelte Variablen der Komponente zuweisen
          for (let varName in result) {
            submissionData.data[variablesToFetchMap[varName]] = result[varName].value;
          }
          this.formData = submissionData;
          this.refreshForm.emit({
              submission: submissionData
          });
        })

      }
  }

  loadFormKey(): void {
    this.camundaRestService.getTaskFormKey(this.taskId)
      .subscribe(formKey => {
        if (formKey.key.substr(0,7)=='formio:'){
          this.formKey = formKey.key.substr(7);
          this.loadFormIOFormDefinition(this.formKey);
        } else {
          console.log('No FormIO Definition found');
        }
        //console.log(this.formKey);


      });
    }

    getFormVariableNamesForTask():any {
      return this.formIOService.getComponentKeysByTag(this.formComponents,"camundaFormVariable");
    }

    onSubmit(submission: any){

      const variables = this.generateVariablesFromSubmission(submission.data);
      this.camundaRestService.postCompleteTask(this.taskId, variables).subscribe((result) => {
        console.log(result);
        this.submitted = true;
        this.router.navigate(['/tasklist']);

      });
    }


    onTest(submission: any){
      console.log(submission);
      /*
      if(this.formData!==null && this.formData!==undefined && this.formData.data !==undefined)
      {
        this.formData.data.vorname="blabla";
        this.refreshForm.emit({
        submission: this.formData
        });

      }*/
    }


    onFormEvent(submission: any) {
      if (submission.type!==null && submission.type!==undefined){
        switch(submission.type) {
          case "testEvent":
              this.onTest(submission);
              break;
          case "submitEvent":
              this.onSubmit(submission);
              break;
          default:
              console.log('Unknown event ', submission);
        }
      }
    }


}
