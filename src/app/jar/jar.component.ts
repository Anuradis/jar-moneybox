import { Component, OnInit } from '@angular/core';
import { JarService } from '../jar.service';
import { IJar } from './jar-interface';

@Component({
  selector: 'app-jar',
  templateUrl: './jar.component.html',
  styleUrls: ['./jar.component.css']
})
export class JarComponent implements OnInit {


jars: IJar[] = [];
errorMessage = '';

  constructor(private jarService: JarService) { }

  ngOnInit(): void {
    this.jarService.getJars().subscribe({
      next: data => {
        this.jars = data;
      },
      error: err => this.errorMessage = err
    });
  }

}
