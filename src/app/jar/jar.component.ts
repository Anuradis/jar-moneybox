import { Component, OnInit } from '@angular/core';
import { JarService } from '../services/jar.service';
import { IJar } from './jar-interface';
import { CurrencyService } from '../services/currency.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-jar',
  templateUrl: './jar.component.html',
})
export class JarComponent implements OnInit {


  jars: IJar[] = [];
  currencyOptions: string[];
  changeCurrencySettings: FormGroup;

  errorMessage = '';

  constructor(private jarService: JarService,
    private currencyService: CurrencyService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jarService.getJars().subscribe({
      next: data => {
        this.jars = data;
        console.log(this.jars);
      },
      error: err => this.errorMessage = err
    });
  }
}
