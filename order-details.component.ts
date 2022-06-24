import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { JobService } from '../../job.service';
import { User } from 'src/app/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {


  constructor(private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder, private router: Router, private jobService: JobService, private _snackBar: MatSnackBar, private modalService: NgbModal) { }
  addordernoteForm: FormGroup;
  addshippingForm: FormGroup;
  customer_order_list;
  order_id;
  order;
  address_id;
  closeResult: string;
  editaddressForm: FormGroup;
  editproductForm: FormGroup;
  panelOpenState = false;
  product_list;
  customer_address;
  product_name;
  created_at;
  order_status;
  name;
  mobile_number;
  city;
  pincode;
  address;
  payment_method;
  grand_total;
  shipping_charge;
  discount;
  service_tax;
  total;
  order_note_list;
  order_shipping_list;
  product_listshow;
  ngOnInit(): void {

    this.order_id = this.activatedRoute.snapshot.params.order_id;

    this.getOrderDetails(this.order_id);

    this.addordernoteForm = this.formBuilder.group({
      id: [''],
      order_id: [this.order_id],
      order_note: [''],


    });
    this.addshippingForm = this.formBuilder.group({
      id: [''],
      order_id: [this.order_id],
      shipping_details: [''],
    });
  }

  submitOrdernote() {
    this.jobService.add_order_note(this.addordernoteForm.value)
      .subscribe(
        data => {
          console.log(data);

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        });
  }

  submitShipping() {
    this.jobService.add_shipping_details(this.addshippingForm.value)
      .subscribe(
        data => {
          console.log(data);

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        });
  }

  getOrderDetails(id) {
    this.jobService.get_order_details(id)
      .subscribe(data => {
        console.log(data);

        if (!data['Error']) {


          //  this.show_page = true;

          this.order = data['order'];
          this.order_id = data['order']['id'];
          this.order_status = data['order']['order_status'];
          this.created_at = data['order']['created_at'];
          this.payment_method = data['order']['pay_method'];

          this.grand_total = data['order']['grand_total'];
          this.shipping_charge = data['order']['shipping_charge'];
          this.discount = data['order']['discount'];
          this.service_tax = data['order']['service_tax'];
          this.total = data['order']['total'];





          this.product_list = data['order']['product_list'];
          this.order_note_list = data['order']['customer_order_note_list'];
          this.order_shipping_list = data['order']['customer_order_shipping_list'];


          this.product_name = data['order']['product_list'][0]['name'];


          this.customer_order_list = data['order']['customer_order_list'];

          this.name = data['order']['customer_address_list']['name'];
          this.mobile_number = data['order']['customer_address_list']['mobile_number'];
          this.city = data['order']['customer_address_list']['city'];
          this.pincode = data['order']['customer_address_list']['pincode'];
          this.address = data['order']['customer_address_list']['address'];
          this.address_id = data['order']['customer_address_list']['address_id'];



        }

        else {

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });

        }
      });
  }
  getproduct_list() {
    this.jobService.product_list()
      .subscribe(
        data => {
          console.log(data);
          this.product_listshow = data['data'];
        });

  }

  open1(content1, id) {
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.editproductForm = this.formBuilder.group({
      id:[''],
      product_selling_price: [''],
      quanity: [''],


    });

    this.jobService.edit_productbyid(+id)
      .subscribe(data => {
        this.editproductForm.setValue(data);


      });

  }

  updateproductSubmit(){
 this.jobService.update_orderproduct(this.editproductForm.value)
      .subscribe(
        data => {
          console.log(data);

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // this.getpart_product_list();
          this.modalService.dismissAll(this);
        },
        error => {
          alert(error);
        });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getproduct_list();
  }


  onproductSubmit2(productId) {


    this.jobService.order_book(+this.order_id, productId)
      .subscribe(data => {
        console.log(data);

        this._snackBar.open(data['message'], "Close", {
          duration: 2000,

          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

      });

  }
  open3(content3, id) {
  }



  delete_product(id) {

  }



  delete_address(id) {
    this.jobService.delete_address(+id)
      .subscribe(data => {
        console.log(data);

        this._snackBar.open(data['message'], "Close", {
          duration: 2000,

          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

      });

  }


  open4(content4, id) {


    this.modalService.open(content4, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.editaddressForm = this.formBuilder.group({
      address_id: [''],
      name: [''],
      mobile_number: [''],
      city: [''],
      pincode: [''],
      address: [''],
      customer_id: ['']

    });

    this.jobService.edit_addressbyid(+id)
      .subscribe(data => {
        this.editaddressForm.setValue(data);


      });


  }
  updateaddressSubmit() {
    this.jobService.update_address(this.editaddressForm.value)
      .subscribe(
        data => {
          console.log(data);

          this._snackBar.open(data['message'], "Close", {
            duration: 2000,

            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // this.getpart_product_list();
          this.modalService.dismissAll(this);
        },
        error => {
          alert(error);
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

}
