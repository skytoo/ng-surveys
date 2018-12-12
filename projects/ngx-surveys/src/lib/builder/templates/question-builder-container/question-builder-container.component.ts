import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';

import {NgxSurveyState} from '../../../store/ngx-survey.state';
import {IElements} from '../../../models/elements.model';
import * as elements from '../../../store/elements/elements.actions';
import * as optionAnswers from '../../../store/option-answers/option-answers.actions';

@Component({
  selector: 'ngxs-question-builder-container',
  templateUrl: './question-builder-container.component.html',
  styleUrls: ['./question-builder-container.component.scss']
})
export class QuestionBuilderContainerComponent implements OnInit {
  @Input() surveyId: string;
  @Input() pageId: string;
  @Input() element: IElements;
  @Input() elementsSize: number;

  @Output() isSavedEvent = new EventEmitter<any>();

  questionType: string;
  prevQuestionType: string;

  constructor(private store: Store<NgxSurveyState>) {
  }

  ngOnInit() {
    this.questionType = this.element.question.type;
    this.prevQuestionType = this.questionType;
    setTimeout(() => {
      if (!!this.questionType) {
        this.isSavedEvent.emit({ key: this.element.id, isSaved: this.element.isSaved });
      }
    }, 100);
  }

  onQuestionTypeSelect(type: string, elementId: string) {
    this.questionType = type;

    if (this.prevQuestionType === 'checkboxes' || this.prevQuestionType === 'radio' || this.prevQuestionType === 'select') {
      this.store.dispatch(new optionAnswers.RemoveOptionAnswersMapAction({ elementId: this.element.id }));
    }

    this.store.dispatch(new elements.RemoveQuestionValuesAction({
      pageId: this.pageId,
      elementId: this.element.id,
    }));

    this.store.dispatch(new elements.AddQuestionTypeAction({
      pageId: this.pageId,
      elementId,
      type,
    }));

    this.store.dispatch(new elements.ToggleIsActiveElementAction({ pageId: this.pageId, elementId, isSaved: false }));
    this.prevQuestionType = type;
  }

  saveQuestion(elementId: string) {
    this.store.dispatch(new elements.ToggleIsActiveElementAction({ pageId: this.pageId, elementId, isSaved: true }));
    this.isSavedEvent.emit({ key: this.element.id, isSaved: true });
  }

  editQuestion(elementId: string) {
    this.store.dispatch(new elements.ToggleIsActiveElementAction({ pageId: this.pageId, elementId, isSaved: false }));
    this.isSavedEvent.emit({ key: this.element.id, isSaved: false });
  }

  removeElement(elementId: string) {
    this.store.dispatch(new elements.RemoveElementAction({ pageId: this.pageId, elementId }));
  }

  moveElementDown(elementId: string) {
    this.store.dispatch(new elements.MoveElementDownAction({ pageId: this.pageId, elementId }));
  }

  moveElementUp(elementId: string) {
    this.store.dispatch(new elements.MoveElementUpAction({ pageId: this.pageId, elementId }));
  }

  trackElement(index: number, item: any) {
    return item ? item.key : null;
  }
}

