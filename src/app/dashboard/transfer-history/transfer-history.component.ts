import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { ITransfer } from './transfer-interface';

@Component({
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.scss']
})
export class TransferHistoryComponent implements OnInit {


  Title: 'Transfer History';
  transfers: ITransfer[] = [];
  sortedTransfers: any;
  sortDir = 1;
  tempList = [];
  errorMessage: string;
  _listFilter = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.sortedTransfers = this.listFilter ? this.perfomFilter(this.listFilter) : this.transfers;
  }

  constructor(private transferService: TransferService) {

  }

  ngOnInit() {
    this.transferService.getTransfers()
      .subscribe({
        next: data => {
          this.transfers = data;
          this.sortedTransfers = this.transfers;
        },
        error: err => this.errorMessage = err
      });
  }

  perfomFilter(filterBy: string): ITransfer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.transfers.filter((transfer: ITransfer) =>
    transfer.to.jarName.toLocaleLowerCase().indexOf(filterBy) !== -1);
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
      return a.localeCompare(b) * this.sortDir;
    });
  }
}

