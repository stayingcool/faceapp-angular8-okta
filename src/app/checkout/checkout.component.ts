import { Component, OnInit, Input, HostListener } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'stripe-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(public oktaAuth: OktaAuthService) { }

  @Input() amount;
  @Input() description;

  handler: StripeCheckoutHandler;

  confirmation: any;
  loading = false;
  isAuthenticated: boolean;
  userName: string;

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: 'pk_test_2XyRY4ZtBsv4A7bO195SsRfb00jX51L4Hv',
      // TODO
      // image: '/your-avatar.png',
      locale: 'auto',
      source: async (source) => {
        this.loading = true;

        this.isAuthenticated = await this.oktaAuth.isAuthenticated();
        if (this.isAuthenticated) {
          const user = await this.oktaAuth.getUser();
          this.userName = user.name;
        }

        // Send this to DynamoDB for persistenace
        // const fun = this.functions.httpsCallable('stripeCreateCharge');
        // this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
        this.loading = false;

      }
    });
  }

  // Open the checkout handler
  async checkout(e) {
    const user = await this.oktaAuth.getUser();
    console.log(user);
    this.handler.open({
      name: 'Techno Trail',
      // description: 'Face Detection - One time charge',
      description: this.description,
      amount: this.amount,
      email: user.email,
    });
    e.preventDefault();
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}