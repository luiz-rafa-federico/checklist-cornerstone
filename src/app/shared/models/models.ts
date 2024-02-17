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
  assignee: string;
  comment: string;
}
