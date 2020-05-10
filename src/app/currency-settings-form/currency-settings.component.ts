import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IJar } from '../jar/jar-interface';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JarService } from '../services/jar.service';
import { CurrencyService } from '../services/currency.service';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.css']
})
export class CurrencySettingsComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Currency Settings';
  errorMessage: string;
  editRequired = 'In order to change currency settings select jar name and searched currency';
  erronOnCreatedJar: string;

  newSettingsForm: FormGroup;
  createdSettingsForm: IJar;

  jars: IJar[] = [];
  currencyOptions: string[];
  private sub: Subscription;


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private jarService: JarService,
              private currencyService: CurrencyService) {}


  ngOnInit(): void {
    this.newSettingsForm = this.fb.group({
      jarName: ['', Validators.required],
      currency: ['', Validators.required],

    });


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
    merge(this.newSettingsForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    );
  }

  onSettingsChange() {
   for (const jar of this.jars) {
     if (this.newSettingsForm.value.jarName === jar.jarName) {
       jar.currency = this.newSettingsForm.value.currency;
       this.createdSettingsForm = {...this.newSettingsForm.value };
       this.createdSettingsForm = jar;
       console.log("onSettingsChange", this.newSettingsForm);
     }
   }
  }


  submitSettings(): void {
    if (this.newSettingsForm.valid) {
      if (this.newSettingsForm.dirty) {
        this.onSettingsChange();
        this.jarService.updateJar(this.createdSettingsForm)
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
    this.newSettingsForm.reset();
    this.router.navigate(['/']);
  }
}
