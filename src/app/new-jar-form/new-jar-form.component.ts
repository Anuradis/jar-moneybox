import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IJar } from '../jar/jar-interface';
import { ITransfer } from '../transfer-history/transfer-interface';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JarService } from '../services/jar.service';
import { debounceTime } from 'rxjs/operators';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-new-jar-form',
  templateUrl: './new-jar-form.component.html',
  styleUrls: ['./new-jar-form.component.css']
})
export class NewJarFormComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    pageTitle = 'Create New Jar';
    errorMessage: string;
    erronOnCreatedJar: string;
    newJarForm: FormGroup;

    jars: IJar[] = [];
    createdJarForm: IJar;
    currencyOptions: string[];
    private sub: Subscription;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private jarService: JarService,
                private currencyService: CurrencyService) {}

    ngOnInit(): void {
      this.newJarForm = this.fb.group({
        jarName: ['', [Validators.required,
                           Validators.minLength(3),
                           Validators.maxLength(25)]],
        accountBalance: [Number, [Validators.min(0),
                          Validators.required]],
        currency: ['', Validators.required],

      });

      this.newJarForm.valueChanges.subscribe(data => console.log('formchanges', data));


      this.jarService.getJars()
      .subscribe({
      next: data => {
        this.jars = data;
        console.log(this.jars);
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

    // ngOnDestroy(): void {
    //   this.sub.unsubscribe();
    // }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
      merge(this.newJarForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(800)
      );
    }

    // calculate(transferedForm: ITransfer, jars: IJar): void {
    //   for (const jar of this.jars) {
    //     if (transferedForm.from.id === jar.id ) {
    //       jar.accountBalance -= transferedForm.amount;
    //       this.fromBalance = jar;
    //     }
    //     if (transferedForm.to.id === jar.id) {
    //       jar.accountBalance += transferedForm.amount;
    //       this.toBalance = jar;
    //     }
    //   }
    // }

    submitNewJar(): void {
      if (this.newJarForm.valid) {
        if (this.newJarForm.dirty) {
            console.log("new jar form before", this.newJarForm);
            this.createdJarForm = {...this.newJarForm.value };
            console.log("new jar form", this.newJarForm);
            this.jarService.addNewJar(this.createdJarForm)
            .subscribe({
              next: () => {},
              error: err => this.erronOnCreatedJar = err
            });
            // this.calculate(this.transferedForm, this.fromBalance);

            // this.jarService.updateFromBalance(this.fromBalance)
            //   .subscribe({
            //     next: () => {},
            //     error: err => this.errorOnFromBalance = err
            //   }),
            //  this.jarService.updateToBalance(this.toBalance)
            //  .subscribe({
            //    next: () => {},
            //    error: err => this.errorOnToBalance = err
            //  }),
            // this.transferService.submitTransfer(this.transferedForm)
            //   .subscribe({
            //     next: () => this.onJarCreated(),
            //     error: err => this.errorMessage = err
            //   });

          // else {
          //   this.jarService.updateJar(t)
          //     .subscribe({
          //       next: () => this.onSaveComplete(),
          //       error: err => this.errorMessage = err
          //     });
          // }
        } else {
          this.onJarCreated();
        }
      } else {
        this.errorMessage = 'Please correct the validation errors.';
      }
      this.onJarCreated();
    }

  onJarCreated(): void {
      this.newJarForm.reset();
      this.router.navigate(['/']);
    }
}
