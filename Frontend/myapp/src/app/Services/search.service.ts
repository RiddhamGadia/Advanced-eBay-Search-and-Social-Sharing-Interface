import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private results: any[] = [];

  constructor(private http : HttpClient) { }

  executeSearch(criteria: any) {
    const transformedCriteria = {
      keyword: criteria.keyword,
      buyerpostalcode: criteria.zip,
      maxdistance: criteria.distance,
      freeshipping: criteria.shippingOptions.freeShipping,
      localpickup: criteria.shippingOptions.localPickup,
      condition: this.convertCondition(criteria.conditionStates),
      categoryId: criteria.categoryId
    };
    
    return this.http.get<any>(`http://localhost:3000/search`, { params: transformedCriteria });
  }
  private convertCondition(conditionStates: any): string {
    const conditions = [];
    
    if (conditionStates.New) {
      conditions.push('New');
    }
    if (conditionStates.Used) {
      conditions.push('Used');
    }
    if (conditionStates.Unspecified) {
      conditions.push('Unspecified');
    }
    
    return conditions.join(','); // Convert array to comma-separated string
  }
  setResults(data: any[]) {
    this.results = data;
  }

  getResults(): any[] {
    return this.results;
  }

}
