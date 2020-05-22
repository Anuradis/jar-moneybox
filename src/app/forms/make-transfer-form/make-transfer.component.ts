import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JarService } from 'src/app/services/jar.service';
import { IJar } from '../../dashboard/jar/jar-interface';
import { ITransfer } from 'src/app/dashboard/transfer-history/transfer-interface';
import { TransferService } from 'src/app/services/transfer.service';
import { resolve } from 'url';


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
  today = new Date().getTime();

  public title: FormControl = new FormControl('', [Validators.minLength(3)]);
  public amount: FormControl = new FormControl('', [Validators.min(0), Validators.max(1000)]);
  public currency: FormControl = new FormControl('', this.availableTo.bind(this));
  public from: FormControl = new FormControl({ value: '', disabled: true });
  public to: FormControl = new FormControl({ value: '', disabled: true });
  public date: FormControl = new FormControl('', this.dateValidator.bind(this));

  constructor(private router: Router,
              private fb: FormBuilder,
              private jarService: JarService,
              private transferService: TransferService) {

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
          this.availableJars = data.map(currency => currency.currency);
          this.currencyOptions = [...new Set(this.availableJars)];
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
        console.log(this.availableFromJars, 'available jarsLength <2');
      } else {
        this.transferForm.controls.from.enable();
        this.transferForm.controls.to.disable();
      }
      console.log(this.availableFromJars, 'available availableFromJars');
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


  // availableTo(group: FormGroup): {[key: string]: boolean | null} {
  //   if (group && group.value !== null || group.value !== undefined) {
  //     if (!group.controls.from.enable) {
  //       return {availableTo : true};
  //     }
  //   }
  //   return null;
  // }


  dateValidator(control: AbstractControl): { [key: string]: boolean | null } {
    if (control && control.value !== null || control.value !== undefined) {
      let selectedDate = new Date (control.value).getTime();
      console.log(typeof selectedDate);
      console.log(typeof this.today);
      console.log(selectedDate, 'selected');
      console.log(this.today, 'today');
      if (this.today <= selectedDate) {
        return { dateValidator : true };
      }
       return null;
    }
  }

  availableTo(control: AbstractControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(this.availableFromJars.length, 'before');
        if (this.availableFromJars.length < 2) {
          resolve({ availableTo: true });
          console.log(control, 'error');
        } else {
          resolve(null);
          console.log(control, 'no error');
        }
      }, 1000);
    });
    console.log(promise);
    return promise;
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


}
