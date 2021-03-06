import { Component, OnInit, Input, Directive } from '@angular/core';
import { SearchService } from './../sharesservices/search.service';
import { ModalComponent } from './../modal/modal.component'
import 'rxjs/Rx';
import { Observable, Subscription } from "rxjs";
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-stocklist',
  templateUrl: './stocklist.component.html',
  styleUrls: ['./stocklist.component.css']
})
export class StocklistComponent implements OnInit {
  stocklist: Array<StockDetail> = [];
  subscription: Array<Subscription>;
  closedModal: number;
  openModal: number;

  constructor(private searchService: SearchService, private http: Http) {
    this.closedModal = SearchService.ModalClicks;
    this.openModal = 0;
    this.subscription = new Array<Subscription>();
  }

  // load and poll stocks
  ngOnInit() {
    this.getStockList();
    this.pollStockList(SearchService.ModalClicks);
  }

  getStockList() {
    if (this.stocklist.length == 0 && SearchService.ModalClicks == 0) {
      this.searchService.getAllStock().subscribe(results => {       
        this.stocklist = results;
      }, error => {
        console.log("error in reading stocklist" + error);
      });
    }
    else {
      console.log("should have data already");
    }
  }

  // poll in interval of 5s and start subscription array
  pollStockList(closeModelClicks) {    
    this.subscription[closeModelClicks] = this.searchService.newPollStockList().subscribe(
      data => {this.stocklist = data},
      error => {console.log("Error in polling stock list"+ error)})    
  }

  // event receiver to start ticking 
  onModalClose(closedModal: number) {
    this.pollStockList(closedModal);
  }

  //event receiver to unsubscribe on modal open
  onModalShow(openModal: number) {
    this.subscription[openModal].unsubscribe();
  }
}

export class StockDetail {
  stockName: string
  previousStockPrice: number
  stockPrice: number
  stockDifference: number
  stockDifferencePercentage: number
  color:string
  constructor(stockName:string, previousStockPrice:number, stockPrice:number, stockDifference:number, stockDifferencePercentage:number) {
      this.stockName = stockName,
      this.previousStockPrice = previousStockPrice,
      this.stockPrice = stockPrice,
      this.stockDifference = stockDifference,
      this.stockDifferencePercentage = stockDifferencePercentage,
      this.color = stockDifference < 0 ? "red" : "green"
  }
  
}
