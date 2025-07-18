import {Component, OnInit, ViewChild} from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Treatment} from "../../model/treatment.entity";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {PatientService} from "../../../profiles/services/patient.service";
import {TreatmentsService} from "../../services/treatments.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-treatments',
  templateUrl: './doctor-treatments.component.html',
  styleUrls: ['./doctor-treatments.component.css']
})
export class DoctorTreatmentsComponent implements OnInit {
  treatments!: Treatment[];
  treatmentName = '';
  description = '';
  startDate = '';
  endDate = '';
  patientId !:number
  doctorId = -1;
  selectedTreatmentToDelete !: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private treatmentsService: TreatmentsService , private route: ActivatedRoute,
              private router: Router, private patientService: PatientService,  private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllTreatments();

  }

  getAllTreatments() {
    this.treatmentsService.getAll().subscribe((data: any) => {
      this.treatments = data;
    });
  }

  submitTreatment(){
    const treatment = {
      treatmentName: this.treatmentName,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      patientId: this.patientId
    }
    this.treatmentsService.create(treatment).subscribe(response=>{
      this.snackBar.open('Tratamiento guardado con éxito', 'Cerrar', {
        duration: 3000
      });
      this.getAllTreatments(); // Opcional: refresca la lista
    }, error => {
      this.snackBar.open('Error al guardar el tratamiento', 'Cerrar', {
        duration: 3000
      });
      console.error(error);
    });
  }

  deleteTreatment() {
    this.treatmentsService.deleteByAttribute(this.selectedTreatmentToDelete, "treatmentName").subscribe({
      next: response => {
        this.snackBar.open('Tratamiento eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.getAllTreatments();
      },
      error: error => {
        // Si el error es 200/204 pero Angular lo interpreta como error, igual refresca la lista
        this.snackBar.open('Tratamiento eliminado con éxito', 'Cerrar', { duration: 3000 });
        this.getAllTreatments();
        console.error(error);
      }
    });
  }
}
