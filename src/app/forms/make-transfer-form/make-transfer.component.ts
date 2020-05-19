import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, min } from 'rxjs/operators';
import { JarService } from 'src/app/services/jar.service';
import { IJar } from '../../dashboard/jar/jar-interface';
import { ITransfer } from 'src/app/dashboard/transfer-history/transfer-interface';
import { TransferService } from 'src/app/services/transfer.service';
import { CurrencyService } from '../../services/currency.service';


@Component({
  selector: 'app-make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.components.scss']
})

export class MakeTransferComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Make Transfer';
  errorMessage: string;
  errorOnFromBalance: string;
  errorOnToBalance: string;
  transferForm: FormGroup;


  public title: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  public amount: FormControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000)]);
  public currency: FormControl = new FormControl('', Validators.required);
  public from: FormControl = new FormControl('', Validators.required);
  public to: FormControl = new FormControl('', Validators.required);
  public date: FormControl = new FormControl('', Validators.required);

  jars: IJar[] = [];
  fromBalance: IJar;
  toBalance: IJar;
  transferedForm: ITransfer;
  currencyOptions: string[];
  avaiableFromJars: IJar[] = [];
  avaiableToJars: IJar[] = [];

  constructor(private router: Router,
    private fb: FormBuilder,
    private jarService: JarService,
    private transferService: TransferService,
    private currencyService: CurrencyService) {

  }

  ngOnInit(): void {
    this.transferForm = new FormGroup({
      title: this.title,
      amount: this.amount,
      currency: this.currency,
      from: this.from,
      to: this.to,
      date: this.date
    });

    this.jarService.getJars()
      .subscribe({
        next: data => {
          this.jars = data;
        },
        error: err => this.errorMessage = err
      });

    this.currencyService.getCurrencyOptions()
      .subscribe({
        next: data => {
          this.currencyOptions = data;
        },
        error: err => this.errorMessage = err
      });

  }

  ngAfterViewInit(): void {

    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.transferForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    );
  }

  get titleFrom() {
    return this.transferForm.get('title');
  }

  updateAccountBasedOnCurrency() {
    if (this.transferForm.value.currency !== '') {
      for (const jar of this.jars) {
        if (jar.currency === this.transferForm.value.currency) {
          this.avaiableFromJars.push(jar);
        } else {
          this.avaiableFromJars = [];
        }
      }
    }
  }

  updateAccountBasedOnFrom(): void {
    if (this.transferForm.value.from !== '') {
      for (const jarFrom of this.avaiableFromJars) {
        if (jarFrom.jarName === this.transferForm.value.from.jarName) {
          this.avaiableToJars = this.avaiableFromJars.filter(e => e !== jarFrom);
        }
      }
    }
  }

  calculate(transferedForm: ITransfer, jars: IJar): void {
    for (const jar of this.jars) {
      if (transferedForm.from.id === jar.id) {
        jar.accountBalance -= transferedForm.amount;
        this.fromBalance = jar;
      }
      if (transferedForm.to.id === jar.id) {
        jar.accountBalance += transferedForm.amount;
        this.toBalance = jar;
      }
    }
  }

  saveTransfer(): void {
    if (this.transferForm.valid) {
      if (this.transferForm.dirty) {
        this.transferedForm = { ...this.transferForm.value };
        this.calculate(this.transferedForm, this.fromBalance);
        this.jarService.updateJar(this.fromBalance)
          .subscribe({
            error: err => this.errorOnFromBalance = err
          }),
          this.jarService.updateJar(this.toBalance)
            .subscribe({
              error: err => this.errorOnToBalance = err
            }),
          this.transferService.submitTransfer(this.transferedForm)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
      } else if (this.transferForm.invalid) {
        console.log(this.transferForm.invalid);
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.transferForm.reset();
    this.router.navigate(['/']);
  }

  transferCustomValidator: ValidatorFn = (form: FormGroup) => {
    const curr = form.value.currency;
    const myFrom = form.value.from;
    const myTo = form.value.to;

    if (curr && myFrom && myTo) {
      if (curr === myFrom.currency && curr === myTo.currency) {
        return null;
      }
    }
    form.get('from').setErrors({ customNotValid: true });
  }
}
