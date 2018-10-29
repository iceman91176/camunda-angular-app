import { Component, OnInit,OnChanges, SimpleChange, Input,EventEmitter } from '@angular/core';

import { CamundaRestService } from '../../camunda-rest.service';
import { FormioService } from '../../formio.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'formio-start-form',
  templateUrl: './formio-start.component.html',
  styleUrls: ['./formio-start.component.css']
})
export class FormioStartComponent implements OnChanges {
  @Input() processDefinitionKey:String = null;
  @Input() taskId:String = null;
  private formKey:String=null;
  private refreshForm: EventEmitter<object>;
  private formReadOnly: boolean = false;
  private formDefinition: any = null;
  private formDefinitionLoaded: boolean = false;
  private formData: any={data:{}};
  private camundaFormModel: any = null;
  private submitted : boolean = false;
  private formComponents:any;
  private formConfig:any;


  constructor(
    private camundaRestService: CamundaRestService,
    private formIOService: FormioService) {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.refreshForm = new EventEmitter();
    this.formConfig={apiUrl:'blabla'};
    for (let propName in changes) {
      console.log(propName);
      if (propName === 'processDefinitionKey' && changes[propName].currentValue != null) {
        console.log(changes[propName].currentValue);
        this.processDefinitionKey = changes[propName].currentValue;
        this.loadFormKey();
        //this.loadForm(changes[propName].currentValue);
      }
    }
  }

  onSubmit(submission: any){
    console.log(submission.data);

    const variables = this.generateVariablesFromSubmission(submission.data);
    console.log(variables);
    this.camundaRestService.postProcessInstance(this.processDefinitionKey, variables).subscribe((result) => {
      //this.camundaFormModel = result;
      console.log(result);
      this.submitted = true;
      this.formReadOnly = true;

    });
    /*
    for (let propName in this.camundaFormVarDefinition) {
      console.log(propName);
    }
    */

  }

  onTest(submission: any){
    console.log(submission);
    if(this.formData!==null && this.formData!==undefined && this.formData.data !==undefined)
    {
      this.formData.data.firstName="blabla";
      this.refreshForm.emit({
      submission: this.formData
      });

    }
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

  generateVariablesFromSubmission(submissionData) {
    const variables = {
      variables: { }
    };
    Object.keys(this.camundaFormModel).forEach((field) => {
      console.log('Looking for CamundaFormField ' + field + ' in formio submission');
      if (submissionData[field]!==null && submissionData[field]!==undefined){
        variables.variables[field] = {
          value: submissionData[field]
        };
      }
    });
    return variables;
  }

  loadFormKey(): void {
    this.camundaRestService.getProcessDefinitionTaskKey(this.processDefinitionKey)
      .subscribe(formKey => {
        if (formKey.key.substr(0,7)=='formio:'){
          this.formKey = formKey.key.substr(7);
          this.formIOService.getFormDefinition(this.formKey)
            .subscribe(formDefinition => {
              this.formDefinition = formDefinition;
              this.formComponents = this.formIOService.getComponents(formDefinition);
              //console.log(this.formComponents);
              this.camundaRestService.getVariablesForProcessDefinitionKey(this.processDefinitionKey,this.getFormVariableNamesForTask().join()).subscribe((result) => {
                this.camundaFormModel = result;
                console.log(result);
              });


          });
        } else {
          console.log('No FormIO Definition found');
        }
        console.log(this.formKey);

      });
  }

  getFormVariableNamesForTask():any {
    return this.formIOService.getComponentKeysByTag(this.formComponents,"camundaFormVariable");
  }


}
