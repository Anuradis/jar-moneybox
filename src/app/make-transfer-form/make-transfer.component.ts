import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge, from } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JarService } from 'src/app/services/jar.service';
import { IJar } from '../jar/jar-interface';
import { ITransfer } from 'src/app/transfer-history/transfer-interface';
import { TransferService } from 'src/app/services/transfer.service';
import { CurrencyService } from '../services/currency.service';
import { format } from 'url';

@Component({
  selector: 'app-make-transfer',
  templateUrl: './make-transfer.component.html',
  styleUrls: ['./make-transfer.component.css']
})

export class MakeTransferComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Make Transfer';
  errorMessage: string;
  errorOnFromBalance: string;
  errorOnToBalance: string;
  transferForm: FormGroup;

  payementButton;

  public title: FormControl = new FormControl('', [Validators.required, Validators.minLength(3),
  Validators.maxLength(25)]);
  public from: FormControl = new FormControl();
  public to: FormControl = new FormControl('', Validators.required);
  public amount: FormControl = new FormControl('', [Validators.required, Validators.min(0)]);
  public currency: FormControl = new FormControl('', Validators.required);
  public date: FormControl = new FormControl('', Validators.required);

  jars: IJar[] = [];
  fromBalance: IJar;
  toBalance: IJar;
  transferedForm: ITransfer;
  currencyOptions: string[];

  private sub: Subscription;

  constructor(private router: Router,
              private fb: FormBuilder,
              private jarService: JarService,
              private transferService: TransferService,
              private currencyService: CurrencyService) {

  }

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      currency: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      date: ['', Validators.required]
    },
      {
        validators: [this.transferCustomValidator]
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
        // this.onSaveComplete();
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
    console.log(form.value.to.currency, '<< currency step by tep too');

    console.log(curr, '<<< currency');
    console.log(form.value.from.jarName, '<<< step from by step');

    return null;
// //     if (myFrom && myTo) {
// //       if (form.value.from.jarName === 'PAY IN') {
// //         return null;
// //       }
// //       form.get('to').setErrors({ customNotValid: true});
// //       if (myFrom && myTo) {
// //     if (form.value.from.currency === form.value.to.currency) {
// //         return null;
// //       }
// //     form.get('from').setErrors({ customNotValid: true });
// //     }
// //   }
// //   }
}
}
