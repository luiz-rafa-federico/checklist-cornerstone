export type Payload = {
  [key: string]: { Action: boolean; description: string }[];
};

export interface IChecklist {
  [key: string]: IGroup[];
}

export interface IGroup {
  id: string;
  Action: boolean;
  description: string;
  complete: boolean;
  file: boolean;
  fileName: string;
  assignee: string;
  comment: string;
  openFile: boolean;
  showFile: boolean;
  openComment: boolean;
  showComment: boolean;
  openAssignee: boolean;
  showAssignee: boolean;
}

export type Responsible = { assignee: string; key: string; taskId: string };
export type Comment = { comment: string; key: string; taskId: string };
export type FileData = { fileName: string; key: string; taskId: string };
