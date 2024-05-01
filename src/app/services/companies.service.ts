import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = AppComponent.baseUrl + '/salles';


  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getCompanies() {
    return this.http.get(`${this.baseUrl}`);
  }

  getCompanyBySiretNumber(siretNumber: number) {
    return this.http.get(
      `${this.baseUrl}/siret=${siretNumber}`);
  }

  getCompanyByBusinessName(businessName: string) {
    return this.http.get(
      `${this.baseUrl}/name=${businessName}`);
  }

  addCompany(company: any) {
    return this.http.post(`${this.baseUrl}`, company);
  }

  updateCompany(siretNumber: number, newCompany: any) {
    return this.http.put(
      `${this.baseUrl}/update/siret=${siretNumber}`,
      newCompany);
  }

  deleteCompany(siretNumber: number) {
    return this.http.delete(
      `${this.baseUrl}/delete/siret=${siretNumber}`);
  }
}
