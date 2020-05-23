import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JarService } from 'src/app/services/jar.service';
import { IJar } from '../../dashboard/jar/jar-interface';
import { ITransfer } from 'src/app/dashboard/transfer-history/transfer-interface';
import { TransferService } from 'src/app/services/transfer.service';
import { resolve } from 'url';
import { currencyValidator } from 'src/app/shared/validators/currencyValidator';


@Component({
  selector: 'app-make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.component.scss']
})

export class MakeTransferComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Make Transfer';
  errorMessage: string;
  errorOnFromBalance: string;
  errorOnToBalance: string;
  transferForm: FormGroup;

  jars: IJar[] = [];
  fromBalance: IJar;
  toBalance: IJar;
  transferedForm: ITransfer;
  currencyOptions: string[];
  availableJars: string[];
  availableFromJars: IJar[] = [];
  availableToJars: IJar[] = [];
  today = new Date();

  constructor(private router: Router,
    private fb: FormBuilder,
    private jarService: JarService,
    private transferService: TransferService) {

  }

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      title: ['', [Validators.minLength(3)]],
      amount: ['', [Validators.min(0), Validators.max(1000)]],
      currency: [''],
      from: [{ value: '', disabled: true }],
      to: [{ value: '', disabled: true }],
      date: [''],
    },
     { validator: currencyValidator }
    );


    this.jarService.getJars()
      .subscribe({
        next: data => {
          this.jars = data;
          this.availableJars = data.map(currency => currency.currency);
          this.currencyOptions = [...new Set(this.availableJars)];
        },
        error: err => this.errorMessage = err
      });

      this.transferForm.value.subscribe(
        (value) => console.log(value)
      )
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


  updateAccountList() {
    this.transferForm.controls.from.setValue('');
    this.availableToJars = [];
    this.availableFromJars = [];
    if (this.transferForm.value.currency !== '') {
      for (const jar of this.jars) {
        if (jar.currency === this.transferForm.value.currency) {
          this.availableFromJars.push(jar);
        }
      }
      if (this.availableFromJars.length < 2) {
        this.availableFromJars = [];
        this.transferForm.controls.from.disable();
        this.transferForm.controls.to.disable();
      } else {
        this.transferForm.controls.from.enable();
        this.transferForm.controls.to.disable();
      }
    }
  }

  updateAccountBasedOnFrom(): void {
    this.transferForm.controls.to.setValue('');
    if (this.transferForm.value.from !== '') {
      for (const jarFrom of this.availableFromJars) {
        if (jarFrom.jarName === this.transferForm.value.from.jarName) {
          this.availableToJars = this.availableFromJars.filter(e => e !== jarFrom);
        }
      }
      this.transferForm.controls.to.enable();
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
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.transferForm.reset();
    this.router.navigate(['/']);
  }

}
