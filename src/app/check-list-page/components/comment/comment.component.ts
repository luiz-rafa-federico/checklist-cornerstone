import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Comment } from 'src/app/shared/models/models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  form!: FormGroup;

  @Input() key = '';
  @Input() taskId = '';

  @Output() commentData = new EventEmitter<Comment>();

  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      comment: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
    });
  }

  onEnterPressed() {
    let commentData: Comment | null = null;

    if (this.comment?.value && this.key && this.comment) {
      commentData = {
        comment: this.comment?.value,
        key: this.key,
        taskId: this.taskId,
      };
      this.form.reset();
      this.commentData.emit(commentData);
    } else {
      this.form.reset();
      return;
    }
  }

  get comment() {
    return this.form.get('comment');
  }
}
