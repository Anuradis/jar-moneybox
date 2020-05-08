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
 errorMessage: string;
 sortBy;

  constructor(private transferService: TransferService) { }

  ngOnInit() {
    this.transferService.getTransfers()
    .subscribe({
      next: data => {
        this.transfers = data;
      },
      error: err => this.errorMessage = err
    });
  }

}
