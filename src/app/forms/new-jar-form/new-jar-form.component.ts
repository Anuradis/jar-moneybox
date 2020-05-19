import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IJar } from '../../jar/jar-interface';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { JarService } from '../../services/jar.service';
import { debounceTime } from 'rxjs/operators';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-new-jar-form',
  templateUrl: './new-jar-form.component.html'
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

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jarService: JarService,
    private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.newJarForm = this.fb.group({
      jarName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25)]],
      accountBalance: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
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
        },
        error: err => this.errorMessage = err
      });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    merge(this.newJarForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    );
  }

  submitNewJar(): void {
    if (this.newJarForm.valid) {
      if (this.newJarForm.dirty) {
        this.createdJarForm = { ...this.newJarForm.value };
        this.jarService.addNewJar(this.createdJarForm)
          .subscribe({
            next: () => { },
            error: err => this.erronOnCreatedJar = err
          });
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
