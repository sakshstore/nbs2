import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { JobService } from '../../job.service';
import { User } from 'src/app/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

   addForm: FormGroup;
  products_list;
  closeResult: string;
  editForm: FormGroup;
  constructor(private router: Router, private _snackBar: MatSnackBar, private modalService: NgbModal, private jobService: JobService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getproduct_list();

    this.addForm = this.formBuilder.group({
      id: [''],
      title: [''],
      amount: [''],
description:[''],
      image: [''],



    });
  }


  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  delete(id) {

    this.jobService.delete_product(+id)
      .subscribe(data => {
        console.log(data);

        this._snackBar.open(data['message'], "Close", {
          duration: 2000,

          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

      });


    this.getproduct_list();
  }



 add(){
 	this.router.navigate(['ecommerce/add-product']);
 }
  edit( id) {

this.router.navigate(['ecommerce/edit-product',id]);
    

  }

  getproduct_list() {
    this.jobService.product_list()
      .subscribe(
        data => {
          console.log(data);
          this.products_list = data['data'];
        });

  }

  updatesubmit() {

    this.jobService.update_product(this.editForm.value)
      .subscribe(
        data => {
          console.log(data);

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });

        });
    this.getproduct_list();
    this.modalService.dismissAll(this);
  }




}
