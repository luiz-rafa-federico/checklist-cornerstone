import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Responsible } from 'src/app/shared/models/models';

@Component({
  selector: 'app-assignee',
  templateUrl: './assignee.component.html',
  styleUrls: ['./assignee.component.scss'],
})
export class AssigneeComponent implements OnInit {
  form!: FormGroup;

  @Input() key = '';
  @Input() taskId = '';

  @Output() responsibleData = new EventEmitter<Responsible>();

  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      assignee: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
    });
  }

  onEnterPressed() {
    let assigneeData: Responsible | null = null;

    if (this.assignee?.value && this.key && this.assignee) {
      assigneeData = {
        assignee: this.assignee?.value,
        key: this.key,
        taskId: this.taskId,
      };
      this.form.reset();
      this.responsibleData.emit(assigneeData);
    } else {
      this.form.reset();
      return;
    }
  }

  get assignee() {
    return this.form.get('assignee');
  }
}
