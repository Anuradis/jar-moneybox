import { Component, OnInit } from '@angular/core';
import { TransferService } from '../services/transfer.service';
import { ITransfer } from './transfer-interface';

@Component({
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.css']
})
export class TransferHistoryComponent implements OnInit {


 transfers: ITransfer[] = [];
 sortedTransfers: any;
 sortDir = 1;
 tempList = [];
 errorMessage: string;

  constructor(private transferService: TransferService) {

   }

  ngOnInit() {
    this.transferService.getTransfers()
    .subscribe({
      next: data => {
        this.transfers = data;
        this.sortedTransfers = data;
      },
      error: err => this.errorMessage = err
    });
  }

  onSortClick($event, sortArr) {
    const target = $event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;

    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.sortArr(sortArr);
  }

  sortArr(colName) {
    this.sortedTransfers.sort((a, b) => {
      a = a[colName];
      b = b[colName];
      if (typeof a === 'number' || typeof b === 'number') {
        a = a.toString();
        b = b.toString();
      }
      const z = a.localeCompare(b) * this.sortDir;
      console.log(z);
      return a.localeCompare(b) * this.sortDir;
    });
  }
}

