import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge, from } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { JarService } from 'src/app/services/jar.service';
import { IJar } from '../jar-interface';
import { ITransfer } from 'src/app/transfer-history/transfer-interface';
import { TransferService } from 'src/app/services/transfer.service';
import { JsonPipe } from '@angular/common';

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

    jars: IJar[] = [];
    fromBalance: IJar;
    toBalance: IJar;
    transferedForm: ITransfer;
    private sub: Subscription;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private jarService: JarService,
                private transferService: TransferService) {

    }

    ngOnInit(): void {
      this.transferForm = this.fb.group({
        title: ['', [Validators.required,
                           Validators.minLength(3),
                           Validators.maxLength(25)]],
        amount: [Number, [Validators.min(0),
                          Validators.required]],
        currency: ['', Validators.required],
        from: [''],
        to: ['', Validators.required]
      });

      this.jarService.getJars()
      .subscribe({
      next: data => {
        this.jars = data;
        console.log(this.jars);
      },
      error: err => this.errorMessage = err
      });
    }

    // ngOnDestroy(): void {
    //   this.sub.unsubscribe();
    // }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
      merge(this.transferForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
      );
    }

    calculate(transferedForm: ITransfer, jars: IJar): void {
      for (const jar of this.jars) {
        if (transferedForm.from.id === jar.id ) {
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
            this.transferedForm = {...this.transferForm.value };
            this.calculate(this.transferedForm, this.fromBalance);
            this.jarService.updateFromBalance(this.fromBalance)
              .subscribe({
                next: () => {},
                error: err => this.errorOnFromBalance = err
              }),
             this.jarService.updateToBalance(this.toBalance)
             .subscribe({
               next: () => {},
               error: err => this.errorOnToBalance = err
             }),
            this.transferService.submitTransfer(this.transferedForm)
              .subscribe({
                next: () => this.onSaveComplete(),
                error: err => this.errorMessage = err
              });
          // else {
          //   this.jarService.updateJar(t)
          //     .subscribe({
          //       next: () => this.onSaveComplete(),
          //       error: err => this.errorMessage = err
          //     });
          // }
        } else {
          this.onSaveComplete();
        }
      } else {
        this.errorMessage = 'Please correct the validation errors.';
      }
    }

onSaveComplete(): void {
      this.transferForm.reset();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['']);
    });
      // this.router.navigate(['/']);
    }
  }
