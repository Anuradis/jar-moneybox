import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IJar } from '../../dashboard/jar/jar-interface';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JarService } from '../../services/jar.service';
import { CurrencyService } from '../../services/currency.service';
import { debounceTime } from 'rxjs/operators';;

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss']
})
export class CurrencySettingsComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Currency Settings';
  errorMessage: string;
  erronOnCreatedJar: string;

  newSettingsForm: FormGroup;
  createdSettingsForm: IJar;

  jars: IJar[] = [];
  currencyOptions: string[];
  currencyOptions1: [];
  private sub: Subscription;


  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jarService: JarService,
    private currencyService: CurrencyService) { }


  ngOnInit(): void {
    this.newSettingsForm = this.fb.group({
      jarName: ['', Validators.required],
      currency: ['', Validators.required],

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
          this.currencyOptions1 = data;
        },
        error: err => this.errorMessage = err
      });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.newSettingsForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    );
  }

  onSettingsChange() {
    for (const jar of this.jars) {
      if (this.newSettingsForm.value.jarName.id === jar.id) {
        jar.currency = this.newSettingsForm.value.currency;
        this.createdSettingsForm = { ...this.newSettingsForm.value };
        this.createdSettingsForm = jar;
      }
    }
  }


  submitSettings(): void {
    if (this.newSettingsForm.valid) {
      if (this.newSettingsForm.dirty) {
        this.onSettingsChange();
        this.jarService.updateJar(this.createdSettingsForm)
          .subscribe({
            error: err => this.erronOnCreatedJar = err
          });
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
