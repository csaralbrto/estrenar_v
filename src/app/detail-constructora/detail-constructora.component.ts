import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-constructora',
  templateUrl: './detail-constructora.component.html',
  styleUrls: ['./detail-constructora.component.scss'],
})
export class DetailConstructoraComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    $(document).foundation();
  }
}
