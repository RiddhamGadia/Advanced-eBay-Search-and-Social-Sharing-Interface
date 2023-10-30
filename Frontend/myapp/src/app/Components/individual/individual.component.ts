import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent {

  constructor(private router: Router){}

  ngOnInit(): void {
    this.router.navigate(['/individual/product']);
  }

}
