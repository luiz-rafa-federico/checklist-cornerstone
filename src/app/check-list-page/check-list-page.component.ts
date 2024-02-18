import { Component, OnInit } from '@angular/core';
import * as data from '../shared/services/payload.json';
import {
  Comment,
  FileData,
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

  // PAYLOAD POST-PROCESSING - NOTATION OF O(n)
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
          showAssignee: false,
          openComment: false,
          showComment: false,
          file: category === 'Additional Attachments',
          fileName: 'File name',
          showFile: false,
          assignee: 'No Assignee',
          comment: 'Your comment',
        }));
      }
    }

    delete checklist['default'];

    return checklist;
  }

  /** MANAGE STATE FUNCTIONS */
  openCloseField(
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
      task.openAssignee = false;
    } else {
      console.error('NO ASSIGNEE DATA PROVIDED');
    }
  }

  showAssignee(key: string, taskId: string, action: 'open' | 'close') {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task) {
      switch (action) {
        case 'open':
          task.showAssignee = true;
          return;
        case 'close':
          task.showAssignee = false;
          return;
      }
    } else {
      console.error('NO ASSIGNEE DATA PROVIDED');
    }
  }

  setComment(commentData: Comment) {
    const { key, comment, taskId } = commentData;

    if (!key || !taskId) {
      console.error('NO KEY OR TASK ID PROVIDED');
      return;
    }

    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task && comment) {
      task.comment = comment;
      task.openComment = false;
    } else {
      console.error('NO COMMENT DATA PROVIDED');
    }
  }

  showComment(key: string, taskId: string, action: 'open' | 'close') {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task) {
      switch (action) {
        case 'open':
          task.showComment = true;
          return;
        case 'close':
          task.showComment = false;
          return;
      }
    } else {
      console.error('NO TASK FOUND');
    }
  }

  setFileName(fileNameData: FileData) {
    const { key, fileName, taskId } = fileNameData;

    if (!key || !taskId) {
      console.error('NO KEY OR TASK ID PROVIDED');
      return;
    }

    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task && fileName) {
      task.fileName = fileName;
      task.openFile = false;
    } else {
      console.error('NO COMMENT DATA PROVIDED');
    }
  }

  showFileName(key: string, taskId: string, action: 'open' | 'close') {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task) {
      switch (action) {
        case 'open':
          task.showFile = true;
          return;
        case 'close':
          task.showFile = false;
          return;
      }
    } else {
      console.error('NO TASK FOUND');
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
