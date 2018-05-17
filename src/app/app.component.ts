import { Component, AfterViewChecked } from '@angular/core';
import { createDirective } from '@angular/compiler/src/core';

declare let paypal: any;
class payPalButton{
  paymentAmount:string;
  styleName: 'checkOutButton' | 'creditButton' | 'payButton' | 'buyNowButton' | 'payPalButton' | 'verticalButtons';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked{
  
  title = 'app';

  addScript: boolean = false;
  paypalLoad: boolean = true;
  paypalButtons: payPalButton[]=[
    {    
      paymentAmount:'10',
      styleName: 'checkOutButton'
    },
    {    
      paymentAmount:'20',
      styleName: 'creditButton'
    },
    {    
      paymentAmount:'30',
      styleName: 'payButton'
    },
    {    
      paymentAmount:'40',
      styleName: 'buyNowButton'
    },
    {    
      paymentAmount:'50',
      styleName: 'payPalButton'
    },
    {    
      paymentAmount:'60',
      styleName: 'verticalButtons'
    }
  ];

  finalAmount: number = 1;

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AVIO_QAEgPnD9zkHGLJ5t1tEnppTn_dxM1oKUyp7RmmuhAH0UcP4zyYGGYNBlkfUFNbYj3nVD36F8sgv',
      production: '<your-production-key here>'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'MXN' } }
          ]
        }
      });
    },
    // onAuthorize() is called when the buyer approves the payment
    onAuthorize: (data, actions) => {
      // Make a call to the REST api to execute the payment
      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
        window.alert('Payment Complete!');
      })
    },

    onCancel: function(data, actions) {
      /* 
       * Buyer cancelled the payment 
      */
      window.alert('Payment Canceled!');
    },

    onError: function(err) {
      /* 
       * An error occurred during the transaction 
      */
      window.alert('Something went wrong with your payment!');   
    }
  };

  constructor(){
    this.addPaypalScript().then(() => {
      this.paypalButtons.forEach(button => {
      paypal.Button.render(this.setPayPalConfig(button.paymentAmount, button.styleName), '#paypal-checkout'+ button.paymentAmount);
      this.paypalLoad = false;
      })
      paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    }); 
  }  
  
  ngAfterViewChecked(): void {
    // if (!this.addScript) {
    //   this.addPaypalScript().then(() => {
    //     paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    //     this.paypalLoad = false;
    //   })
    // }
    // if (!this.addScript) {
    //   this.addPaypalScript().then(() => {
    //     this.paypalButtons.forEach(button => {
    //       paypal.Button.render(this.setPayPalConfig(button.paymentAmount, button.styleName), '#paypal-checkout'+ button.paymentAmount);
    //       this.paypalLoad = false;
    //       })
    //       paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    //   })
    // }
  };

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');    
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    })
  }

  setPayPalConfig( paymentAmount:string, styleName:string){
    let style={};
    let funding={};
    switch (styleName) {
      case 'checkOutButton':
        style={
          label: 'checkout',
          size:  'small',    // small | medium | large | responsive
          shape: 'pill',     // pill | rect
          color: 'gold'      // gold | blue | silver | black
        }
        break;
      case 'creditButton':
        style={
          size:  'medium', // small | medium | large | responsive
          shape: 'rect',  // pill | rect
          tagline: false
        };
        funding={
            allowed: [ paypal.FUNDING.CREDIT ]
        };
        break; 
      case 'payButton':
        style={
          label: 'pay',
          size:  'small', // small | medium | large | responsive
          shape: 'rect',   // pill | rect
          color: 'gold'   // gold | blue | silver | black
        }; 
        break;  
      case 'buyNowButton':
        style={
          label: 'buynow',
          fundingicons: true, // optional
          branding: true, // optional
          size:  'small', // small | medium | large | responsive
          shape: 'rect',   // pill | rect
          color: 'gold'   // gold | blue | silve | black
        };
        break; 
      case 'payPalButton':
        style={
          label: 'paypal',
          size:  'medium',    // small | medium | large | responsive
          shape: 'rect',     // pill | rect
          color: 'blue',     // gold | blue | silver | black
          tagline: false    
        };
        break; 
      case 'verticalButtons':
        style={
          layout: 'vertical',  // horizontal | vertical
          size:   'medium',    // medium | large | responsive
          shape:  'rect',      // pill | rect
          color:  'gold'       // gold | blue | silver | black
        };

        // Specify allowed and disallowed funding sources
        //
        // Options:
        // - paypal.FUNDING.CARD
        // - paypal.FUNDING.CREDIT
        // - paypal.FUNDING.ELV

        funding={
            allowed: [ paypal.FUNDING.CARD, paypal.FUNDING.CREDIT ],
            disallowed: [ ]
        };
        break;
      default:
        break;
    }

    let paypalConfig = {
      env: 'sandbox', // sandbox | production

      style: style,
      funding: funding,

  
      // PayPal Client IDs - replace with your own
      // Create a PayPal app: https://developer.paypal.com/developer/applications/create
      //'AYkveOu3MvRusW.v1N.XXoAWT5RPASrxOdJQ1.4JxdRizEZX6syQi1Eq'
      //'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
      client: {
        sandbox: 'AVIO_QAEgPnD9zkHGLJ5t1tEnppTn_dxM1oKUyp7RmmuhAH0UcP4zyYGGYNBlkfUFNbYj3nVD36F8sgv',  //'<your-sandbox-key-here>',
        production: '<your-production-key here>'
      },
  
      // Show the buyer a 'Pay Now' button in the checkout flow
      commit: true,
  
      // payment() is called when the button is clicked
      payment: (data, actions) => {
        // Make a call to the REST api to create the payment
        console.log("data",data);
        console.log(paymentAmount);
        return actions.payment.create({
          payment: {
            transactions: [
              { amount: { total: paymentAmount, currency: 'MXN' } }
            ]
          }
        });
      },
  
      // onAuthorize() is called when the buyer approves the payment
      onAuthorize: (data, actions) => {
        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then((payment) => {
          //Do something when payment is successful.
          window.alert('Payment Complete!');
        })
      },
  
      onCancel: function(data, actions) {
        /* 
         * Buyer cancelled the payment 
        */
        window.alert('Payment Canceled!');
      },
  
      onError: function(err) {
        /* 
         * An error occurred during the transaction 
        */
        window.alert('Something went wrong with your payment!');   
      }
    };
    return paypalConfig;
  }

  choose(choice){
    console.log(choice);
  }


}


