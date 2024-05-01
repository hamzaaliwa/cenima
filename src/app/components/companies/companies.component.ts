import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../services/companies.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { TutorsComponent } from '../tutors/tutors.component';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, TutorsComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent implements OnInit {
  SalleForm = new FormGroup({
    id: new FormControl(),
    nom: new FormControl(''),
    nombreplaces: new FormControl(''),
    //cinéma: new FormControl(''),
  });

  displayedColumns: string[] = [
    'ID de la salle',
    'Nom de la salle',
    'Nombre de places',
  ];
  companiesList: any[] = [];
  editMode = false;
  currentSiretNumber: number = 0;

  constructor(
    private companiesService: CompaniesService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    return this.companiesService.getCompanies().subscribe({
      next: (data: any) => {
        this.companiesList = data._embedded.salles;
      },
      error: (e: any) => {
        if (e.status === 403) {
          this.tokenStorageService.logout();
        }
      },
    });
  }

  handleSearch(event: any) {
    const keyWord = event.target.value.toLowerCase();
    if (keyWord) {
      this.companiesList = this.companiesList.filter((entreprise: any) => {
        return entreprise.businessName.toLowerCase().includes(keyWord);
      });
    } else {
      this.getCompanies();
    }
  }

  getCompanyBySiretNumber(siretNumber: number) {
    return this.companiesService
      .getCompanyBySiretNumber(siretNumber)
      .subscribe({
        next: (data: any) => console.log(data),
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  getCompanyByBusinessName(businessName: string) {
    return this.companiesService
      .getCompanyByBusinessName(businessName)
      .subscribe({
        next: (data: any) => console.log(data),
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  handleCompanyForm() {
    if (this.editMode) {
      this.updateCompany();
    } else {
      this.addCompany();
    }
  }

  handleUpdateCompany(entreprise: any) {
    this.editMode = true;
    this.currentSiretNumber = entreprise.siretNumber;
    this.SalleForm.patchValue(entreprise);
  }

  addCompany() {
    if (this.SalleForm.valid) {
      this.companiesService.addCompany(this.SalleForm.value).subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.SalleForm.reset();
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
    } else {
      console.log('invalid form');
    }
  }

  updateCompany() {
    this.companiesService
      .updateCompany(this.currentSiretNumber, this.SalleForm.value)
      .subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.editMode = false;
          this.SalleForm.reset();
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  deleteCompany(siretNumber: number) {
    this.companiesService.deleteCompany(siretNumber).subscribe({
      next: (data: any) => {
        this.getCompanies();
      },
      error: (e: any) => {
        if (e.status === 403) {
          this.tokenStorageService.logout();
        }
      },
    });
  }
}
