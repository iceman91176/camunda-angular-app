import { Component, OnInit ,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CamundaRestService } from '../camunda-rest.service';
import { FormioService } from '../formio.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-formio-dummy',
  templateUrl: './formio-dummy.component.html',
  styleUrls: ['./formio-dummy.component.css']
})
export class FormioDummyComponent implements OnInit {

  private processDefinitionKey: String = null;
  private formKey: String = null;
  private refreshForm: EventEmitter<object>;
  private formReadOnly: boolean = false;
  private formDefinition: any = null;
  private formDefinitionLoaded: boolean = false;
  private formData: any={data:{}};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private camundaRestService: CamundaRestService,
              private formIOService: FormioService
              ) { }

  ngOnInit() {
    this.refreshForm = new EventEmitter();
    this.processDefinitionKey = 'myprocess';
    this.loadTaskKey();
    this.formIOService.getFormDefinition('camundaform01')
      .subscribe(formDefinition => {
        this.formDefinition = formDefinition;
        this.formDefinitionLoaded = true;
    });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  onSubmit(submission: any) {
    console.log('Hier bin ich');

    if (submission.type=='testEvent'){

      if(this.formData!==null && this.formData!==undefined && this.formData.data !==undefined)
      {
        this.formData.data.firstName="blabla";
        this.refreshForm.emit({
        submission: this.formData
        });

      }



      //this.formData.data.firstName="blabla";

    }

    console.log(submission);
  }

  loadTaskKey(): void {
    this.camundaRestService.getProcessDefinitionTaskKey(this.processDefinitionKey)
      .subscribe(formKey => {
        this.formKey = formKey.key
        console.log(this.formKey);

        this.camundaRestService.getVariablesForProcessDefinitionKey(this.processDefinitionKey,"approved").subscribe((result) => {
          console.log(result);
        });


      });
  }

}
