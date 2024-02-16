import { Component, OnInit } from '@angular/core';
import * as data from '../shared/services/payload.json';

@Component({
  selector: 'app-check-list-page',
  templateUrl: './check-list-page.component.html',
  styleUrls: ['./check-list-page.component.scss'],
})
export class CheckListPageComponent implements OnInit {
  constructor() {
    const payload = JSON.parse(JSON.stringify(data));

    console.log('payload =>', payload);
  }

  ngOnInit(): void {}
}
