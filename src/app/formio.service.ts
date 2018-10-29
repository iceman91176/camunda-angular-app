import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessDefinition } from './schemas/ProcessDefinition';
import { Task } from './schemas/Task';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FormioService {
  private engineRestUrl = 'http://localhost:4200/forms'

  constructor(private http: HttpClient) {

  }

  getFormDefinition(formPath): Observable<any> {
    const url = `${this.engineRestUrl}/${formPath}`;
    return this.http.get<any>(url).pipe(
      tap(form => this.log(`fetched FormIO definition`)),
      catchError(this.handleError('getFormIODefinition', []))
    );
  }

  getComponentsByTag(formComponents:any,tag:String):any{
    return formComponents.filter(function (component) {
        //console.log(component.tags);
        if (component.tags.includes(tag)){
          return component;
        }
    });
  }

  getComponentKeysByTag(formComponents:any,tag:String):any{
    return this.getComponentsByTag(formComponents,tag).map(function (component) {
      return component.key
    });
  }

  getComponents(formDefinition:any):any{
    const myList = this.findValuesHelper(formDefinition,"components");
    let list = [];
    for (var i in myList){
      if (myList[i] instanceof Array) {
        for (var j in myList[i]){
          switch (myList[i][j].type){
            case "columns":
              break;
            default:
              list.push(myList[i][j]);
              break;
          }
        }
      }

    }
    return list;
  }

  private findValuesHelper(obj, key):any {
        let list = [ ];
        if (!obj) return list;
        if (obj instanceof Array) {
            for (var i in obj) {
                list = list.concat(this.findValuesHelper(obj[i], key));
            }
            return list;
        }
        if (obj[key]) list.push(obj[key]);

        if ((typeof obj == "object") && (obj !== null)) {
            let children = Object.keys(obj);
            if (children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    list = list.concat(this.findValuesHelper(obj[children[i]], key));
                }
            }
        }
        return list;
    }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
