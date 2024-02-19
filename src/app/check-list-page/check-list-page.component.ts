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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  checkList: IChecklist =
    JSON.parse(sessionStorage.getItem('checklist') as string) || {};

  category = '';
  taskId = '';

  payloadParsed =
    JSON.parse(sessionStorage.getItem('payloadParsed') as string) || 0;

  progressWidth = 0;

  totalItems = 0;
  completedItems = 0;

  constructor() {
    const payload: Payload = JSON.parse(JSON.stringify(data));

    if (payload && this.payloadParsed === 0) {
      const checklist = this.parsePayload(payload);
      this.setChecklist(checklist);
      this.payloadParsed = 0;
      this.payloadParsed = this.payloadParsed + 1;
      sessionStorage.setItem('payloadParsed', this.payloadParsed);
    } else {
      this.saveChecklistToSessionStorage(this.checkList);
    }
  }

  ngOnInit(): void {
    this.progressWidth = this.calculateProgress(this.checkList);
  }

  /** PROCESSING */
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

      delete checklist['default'];
    }

    return checklist;
  }

  completeTask(key: string, taskId: string) {
    const group = this.findGroup(key);
    const task = this.findtask(group, taskId);

    if (task) {
      task.complete = !task.complete;
      this.saveChecklistToSessionStorage(this.checkList);
    } else {
      console.error('NO TASK FOUND');
    }
  }

  allGroupTasksComplete(tasks: IGroup[]): string {
    const tasksComplete = tasks.filter((t) => t.complete);

    if (tasksComplete.length === tasks.length) {
      return 'card-status-success';
    }
    return 'card-status-warning';
  }

  calculateProgress(data: IChecklist) {
    this.totalItems = 0;
    this.completedItems = 0;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const array = data[key];
        this.totalItems += array.length;

        for (const item of array) {
          if (item.complete) {
            this.completedItems++;
          }
        }
      }
    }

    return this.totalItems > 0
      ? (this.completedItems / this.totalItems) * 100
      : 0;
  }

  downloadExcel(category: string, tasks: IGroup[]) {
    let tasksToDownload = [];
    tasksToDownload = this.parseDownloadObject(tasks);

    const sheetName = category.slice(0, 30);

    const worksheet1: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(tasksToDownload);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        [sheetName]: worksheet1,
      },
      SheetNames: [sheetName],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.exportExcel(excelBuffer, category);
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
      task.showAssignee = false;
      this.saveChecklistToSessionStorage(this.checkList);
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
      task.showComment = false;
      this.saveChecklistToSessionStorage(this.checkList);
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
      task.showFile = false;
      this.saveChecklistToSessionStorage(this.checkList);
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

  /** HELPERS, SETTERS AND GETTERS */
  setChecklist(data: IChecklist) {
    sessionStorage.setItem('checklist', JSON.stringify(data));
    this.checkList = JSON.parse(sessionStorage.getItem('checklist') as string);

    this.progressWidth = this.calculateProgress(this.checkList);
  }

  saveChecklistToSessionStorage = (data: IChecklist) => this.setChecklist(data);

  findGroup = (key: string) => this.checkList[key];

  findtask = (group: IGroup[], id: string) => group.find((t) => t.id === id);

  parseDownloadObject(tasks: IGroup[]) {
    const output = [];

    for (const task of tasks) {
      output.push({
        Task: task.description,
        FileName: task.file ? task.fileName : 'None',
        Comment: task.comment,
        Assignee: task.assignee,
        Complete: task.complete ? 'Yes' : 'No',
      });
    }

    return output;
  }

  exportExcel(file: any, fileName: string) {
    const data: Blob = new Blob([file], {
      type: 'EXCEL_TYPE',
    });

    saveAs(data, `${fileName}-${Date.now()}.xlsx`);
  }
}
