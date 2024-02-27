import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #confirmAccountIdFormat(accountId) {
    return accountId > 0 && Number.isInteger(accountId)
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    const confirmedAccountId = this.#confirmAccountIdFormat(accountId);

    // // Error handling for incorrect accountID type.
    // if (!confirmedAccountId) {
    //   //InvalidPurchaseException currently empty
    //   throw new InvalidPurchaseException;
    // };

    let adults = false;
    let noOfTickets = 0;
    let totalSeatsToAllocate = 0;
    let totalAmountToPay = 0;

    for (let ticketTypeRequest of ticketTypeRequests) {
      if (typeof ticketTypeRequest !== "object" || Array.isArray(ticketTypeRequest) || ticketTypeRequest === null) {
        throw new TypeError(`ticketTypeRequests must be objects`);
      };
      
      const objectKey = Object.keys(ticketTypeRequest)[0];

      const ticketDetails = new TicketTypeRequest(objectKey, ticketTypeRequest[objectKey]);
      // Could set a variable to equal ticketDetails.getNoOfTickets() but then would render the function useless...

      noOfTickets += ticketDetails.getNoOfTickets();

      switch (ticketDetails.getTicketType()) {
        case "ADULT":
          adults = true;
          totalSeatsToAllocate += ticketDetails.getNoOfTickets();
          totalAmountToPay += ticketDetails.getNoOfTickets() * 20;
          break;
        case "CHILD":
          totalSeatsToAllocate += ticketDetails.getNoOfTickets();
          totalAmountToPay += ticketDetails.getNoOfTickets() * 10;
          break;
      };
    };

    if (adults) {
      const ticketPaymentService = new TicketPaymentService;
      ticketPaymentService.makePayment(accountId, totalAmountToPay);

      const seatReservationService = new SeatReservationService;
      seatReservationService.reserveSeat(accountId, totalSeatsToAllocate)
    } else {
      throw new Error("Children and Infant tickets cannot be purchased without an accompanying Adult");
    };





    // throws InvalidPurchaseException
    console.log("Method complete.")
  };
};

 const test = new TicketService
test.purchaseTickets(3, {ADULT: 5}, {CHILD: 3})