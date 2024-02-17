import { Component, Input, OnInit } from '@angular/core';
import * as data from '../shared/services/payload.json';
import {
  IChecklist,
  IGroup,
  Payload,
  Responsible,
} from '../shared/models/models';

@Component({
  selector: 'app-check-list-page',
  templateUrl: './check-list-page.component.html',
  styleUrls: ['./check-list-page.component.scss'],
})
export class CheckListPageComponent implements OnInit {
  instructions = [
    {
      icon: 'paperclip',
      color: { color: '#e3782c' },
      description: 'Attach a file',
    },
    {
      icon: 'comment',
      color: { color: '#54B4D3' },
      description: 'Add or edit a comment',
    },
    {
      icon: 'person',
      color: { color: '#3B71CA' },
      description:
        'Add or edit the person assigned to complete an actionable task',
    },
    {
      icon: 'square-check',
      color: { color: '#14A44D' },
      description: 'This icon will appear after checking off the task',
    },
  ];

  cardColors = [
    { backgroundColor: '#98C1D9' },
    { backgroundColor: '#98D5D9' },
    { backgroundColor: '#FEFFDA' },
    { backgroundColor: '#98ACD9' },
    { backgroundColor: '#98D9C6' },
    { backgroundColor: '#9898D9' },
    { backgroundColor: '#A6C6D9' },
    { backgroundColor: '#FEF5D8' },
    { backgroundColor: '#FEF5D8' },
    { backgroundColor: '#D0EDFD' },
    { backgroundColor: '#98C1D9' },
    { backgroundColor: '#98D5D9' },
    { backgroundColor: '#FEFFDA' },
    { backgroundColor: '#98ACD9' },
    { backgroundColor: '#98D9C6' },
    { backgroundColor: '#9898D9' },
    { backgroundColor: '#A6C6D9' },
    { backgroundColor: '#FEF5D8' },
    { backgroundColor: '#FEF5D8' },
    { backgroundColor: '#D0EDFD' },
  ];

  checkList: IChecklist = {};

  category = '';
  taskId = '';

  constructor() {
    const payload: Payload = JSON.parse(JSON.stringify(data));

    if (payload) {
      const checklist = this.parsePayload(payload);
      this.setCheclist(checklist);
    } else {
      console.error('DEVELOPER, NO PAYLOAD PROVIDED.');
      return;
    }
  }

  ngOnInit(): void {}

  completeTask(key: string, taskId: string) {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task) {
      task.complete = !task.complete;
    } else {
      console.error('NO TASK FOUND');
    }
  }

  // POST-PROCESSING - NOTATION OF O(n)
  parsePayload(data: Payload): IChecklist {
    const checklist: IChecklist = {};

    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        checklist[category] = Array.from(data[category]).map((item, index) => ({
          id: `${category}_${index}`,
          Action: item.Action,
          description: item.description,
          complete: false,
          openFile: false,
          openAssignee: false,
          openComment: false,
          file: category === 'Additional Attachments',
          fileName: '',
          assignee: '',
          comment: '',
        }));
      }
    }

    delete checklist['default'];

    return checklist;
  }

  /** MANAGE STATE FUNCTIONS */
  openField(
    key: string,
    taskId: string,
    field: 'file' | 'comment' | 'assignee'
  ) {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    this.category = key;
    this.taskId = taskId;

    if (task) {
      switch (field) {
        case 'file':
          task.openFile = !task.openFile;
          return;
        case 'comment':
          task.openComment = !task.openComment;
          return;
        case 'assignee':
          task.openAssignee = !task.openAssignee;
          return;
      }
    } else {
      console.error('NO TASK FOUND');
    }
  }

  setAssignee(assigneeData: Responsible) {
    const { key, assignee, taskId } = assigneeData;

    if (!key || !taskId) {
      console.error('NO KEY OR TASK ID PROVIDED');
      return;
    }

    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task && assignee) {
      task.assignee = assignee;
    } else {
      console.error('NO ASSIGNEE DATA PROVIDED');
    }
  }

  // HELPERS, SETTERS AND GETTERS
  setCheclist(data: IChecklist) {
    this.checkList = data;
  }

  findGroup(key: string) {
    return this.checkList[key];
  }

  findtask(group: IGroup[], id: string) {
    return group.find((t) => t.id === id);
  }
}
