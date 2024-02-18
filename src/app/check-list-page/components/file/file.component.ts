import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileData } from 'src/app/shared/models/models';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit {
  form!: FormGroup;

  @Input() key = '';
  @Input() taskId = '';

  @Output() fileData = new EventEmitter<FileData>();

  constructor(public formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      file: new FormControl(
        { value: null, disabled: false },
        Validators.required
      ),
      fileName: new FormControl(
        { value: '', disabled: false },
        Validators.required
      ),
    });
  }

  handleFile(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.fileName?.setValue(file.name);

      /**
      @COMMENT
      HTTP POST REQUEST TO SEND THE FILE TO THE SERVER

      const formData = new FormData();
      formData.append('thumbnail', file);
      const upload$ = this.http.post('/api/endpoint', formData);
      upload$.subscribe()...;
      */

      this.submitFileData();
    } else {
      console.error('NO FILE UPLOADED');
      return;
    }
  }

  submitFileData() {
    let fileData: FileData | null = null;

    if (this.fileName?.value && this.key && this.taskId) {
      fileData = {
        fileName: this.fileName?.value,
        key: this.key,
        taskId: this.taskId,
      };
      this.form.reset();
      this.fileData.emit(fileData);
    } else {
      this.form.reset();
      return;
    }
  }

  get fileName() {
    return this.form.get('fileName');
  }
}
