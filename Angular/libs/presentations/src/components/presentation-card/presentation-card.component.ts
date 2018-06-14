import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { Presentation } from '@labdat/data-models';
import { MatDialog } from '@angular/material/dialog';
//import { NotifBarService } from 'app/core';
import { selectUser, selectIsLoggedIn, AuthenticationState } from '@labdat/authentication';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { PresentationsApiService } from '@labdat/presentations-state';
import { User } from '@labdat/data-models';
import { PublishDialogComponent } from './publish-dialog/publish-dialog.component';
@Component({
  selector: 'app-slides-card',
  templateUrl: './presentation-card.component.html',
  styleUrls: ['./presentation-card.component.scss']
})
export class PresentationCardComponent implements OnInit {
  @Output() public select = new EventEmitter();

  @Input() public presentation: Presentation;

  @Input() public showCopy = false;

  @Input() public editable: boolean; // whether the presentation can be edited;

  @Input() public loggedIn: boolean;

  @Input() public user: User;

  @Output() public delete = new EventEmitter();

  @Output() public edit = new EventEmitter();

  @Output() public isPublishChange = new EventEmitter();

  @Output() public isFavoriteChange = new EventEmitter();

  @Output() public copy = new EventEmitter();

  @Output() public shareOptionChange = new EventEmitter();

  public loggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  public userName$ = this.store
    .select(selectUser)
    .pipe(filter(user => !isEmpty(user)), map(user => user.firstName + user.lastName));

  public banner: string; // banner picture of the presentation card

  constructor(
    //    private slidesService: PresentationsApiService,
    private dialog: MatDialog,
    private store: Store<AuthenticationState>
  ) /*        private notifBarService: NotifBarService */ {
    this.banner = '';
  }

  ngOnInit() {
    /*after load presentation info, load presentation banner*/
    if (this.presentation.banner) {
      //      this.imagesService.getImage(this.presentation.banner).subscribe(_banner => {
      //        this.banner = _banner;
      //      });
    }
  }

  public selectPresentation() {
    this.select.emit();
  }

  public togglePublish(event) {
    //            elm => this.notifBarService.showNotif("set upload status successfully!"),
    //            error => this.notifBarService.showNotif("fail to set upload status, error is " + error)
    event.preventDefault();
    event.stopPropagation();
    this.isPublishChange.emit(this.presentation);
  }
  public sharePresentation(){
    event.preventDefault();
    event.stopPropagation();
    const dialog = this.dialog.open(PublishDialogComponent, { height: '30%', width: '30%' });
    const dialogSubscription = dialog.afterClosed().subscribe(users => {
      console.log(users);
      this.shareOptionChange.emit({id: this.presentation.id, users :users});
    });
  }
  /*set like/dislike presentation*/
  public toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isFavoriteChange.emit(this.presentation);
  }

  public editPresentation(event) {
    event.preventDefault();
    event.stopPropagation();
    this.edit.emit(this.presentation.id);
  }

  public deletePresentation(event) {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.presentation.id);
  }
  /*duplicate presentation*/
  public copyPresentation(event) {
    event.preventDefault();
    event.stopPropagation();
    this.copy.emit(this.presentation.id);
    // this.notifBarService.showNotif("presentation has been copied");
    // this.notifBarService.showNotif("Opps! fail to copy the presentation. error :" + error);
  }
}
