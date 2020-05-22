import { Component, OnInit } from '@angular/core';
import { JarService } from '../../services/jar.service';
import { IJar } from './jar-interface';
import { CurrencyService } from '../../services/currency.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-jar',
  templateUrl: './jar.component.html',
  styleUrls: ['./jar.component.scss']
})
export class JarComponent implements OnInit {


  jars: IJar[] = [];

  errorMessage = '';

  constructor(private jarService: JarService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jarService.getJars().subscribe({
      next: data => {
        this.jars = data;
      },
      error: err => this.errorMessage = err
    });
  }
}
