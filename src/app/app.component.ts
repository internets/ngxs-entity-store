import {Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {
  AddOrReplace,
  AddOrReplaceAll,
  Clear,
  ClearActive,
  Remove,
  RemoveAll,
  SetActive,
  SetError,
  Update,
  UpdateActive,
  UpdateAll
} from './store/entity-store';
import {ToDo, TodoState} from './store/todo';
import {Observable} from 'rxjs';
import {SetLoading} from './store/entity-store/action-generator';
import {Reset} from './store/entity-store/action-generator/reset';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @Select(TodoState.size) count$: Observable<number>;
  @Select(TodoState.entities) toDos$: Observable<ToDo[]>;
  @Select(TodoState.active) active$: Observable<ToDo>;
  @Select(TodoState.activeId) activeId$: Observable<string>;
  @Select(TodoState.keys) keys$: Observable<string[]>;
  @Select(TodoState.loading) loading$: Observable<boolean>;
  @Select(TodoState.error) error$: Observable<Error | undefined>;

  private counter = 0;
  private loading = false;
  private error = false;

  constructor(private store: Store) {
    /*this.store.dispatch(AddOrReplace(TodoState, {
      title: 'NGXS Entity Store 0',
      description: 'Some Descr 0',
      done: false
    }));

    this.store.dispatch(AddOrReplaceAll(TodoState,
      [
        {
          title: 'NGXS Entity Store 1',
          description: 'Some Descr 1',
          done: false
        },
        {
          title: 'NGXS Entity Store 2',
          description: 'Some Descr 2',
          done: false
        }
      ]
    ));*/
  }

  toggleLoading() {
    this.loading = !this.loading;
    this.store.dispatch(SetLoading(TodoState, this.loading));
  }

  removeToDo(title: string) {
    this.store.dispatch(Remove(TodoState, title));
  }

  setDone(toDo: ToDo) {
    this.store.dispatch(Update(TodoState, {
      ...toDo, // for title as id
      done: true
    }));
  }

  closeDetails() {
    this.store.dispatch(ClearActive(TodoState));
  }

  toggleError() {
    this.error = !this.error;
    this.store.dispatch(SetError(TodoState, this.error ? new Error('Example error') : undefined));
  }

  setDoneActive() {
    this.store.dispatch(UpdateActive(TodoState, {
      done: true
    }));
  }

  open(title: string) {
    this.store.dispatch(SetActive(TodoState, title));
  }

  removeFirstThree(toDos: ToDo[]) {
    this.removeMultiple(toDos.slice(0, 3).map(t => t.title));
  }

  removeMultiple(titles: string[]) {
    this.store.dispatch(RemoveAll(TodoState, titles));
  }

  clearEntities() {
    this.store.dispatch(Clear(TodoState));
  }

  addToDo() {
    this.store.dispatch(AddOrReplace(TodoState, {
      title: 'NGXS Entity Store ' + (++this.counter),
      description: 'Some Descr' + this.counter,
      done: false
    }));
  }

  doneAll(toDos: ToDo[]) {
    this.store.dispatch(UpdateAll(
      TodoState,
      toDos.map(t => ({...t, done: true}))
    ));
  }

  // for tests

  resetState() {
    this.store.dispatch(Reset(TodoState));
  }

  addMultiple() {
    this.store.dispatch(AddOrReplaceAll(TodoState,
      [
        {
          title: 'NGXS Entity Store 1',
          description: 'Some Descr 1',
          done: false
        },
        {
          title: 'NGXS Entity Store 2',
          description: 'Some Descr 2',
          done: false
        }
      ]
    ));
  }

}
