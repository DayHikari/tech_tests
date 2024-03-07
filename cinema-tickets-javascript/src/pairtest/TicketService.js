import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  #noOfTickets = {
    "ADULT": 0,
    "CHILD": 0,
    "INFANT": 0,
  };
  #getNoOfTickets() {
    return Object.values(this.#noOfTickets).reduce((a,b) => a + b, 0);
  };
  #getNoOfTicketType(ticketType) {
    return this.#noOfTickets[ticketType];
  };
  #setNoOfTickets(ticketType, value) {
    this.#noOfTickets[ticketType] += value;
  };

  #totalSeatsToAllocate;
  #getTotalSeatsToAllocate() {
    return this.#totalSeatsToAllocate;
  };
  #setTotalSeatsToAllocate(value) {
    // Cannot be more than 20
    if (typeof value !== "number") {
      throw new TypeError("Seats to allocate arguement must be a number.")
    }

    this.#totalSeatsToAllocate = value;
  };

  #totalAmountToPay;
  #getTotalAmountToPay() {
    return this.#totalAmountToPay;
  };
  #setTotalAmountToPay(value) {
    this.#totalAmountToPay = value;
  };

  #ticketRequestionInformation;
  #getTicketRequestionType() {
    return this.#ticketRequestionInformation.getTicketType();
  };
  #getTicketRequestionQuantity() {
    return this.#ticketRequestionInformation.getNoOfTickets();
  };
  #setTicketRequestInformation(ticketTypeFunction) {
    this.#ticketRequestionInformation = ticketTypeFunction;
  };

  #ticketPaymentService;
  #setTicketPaymentService(ticketPaymentClass) {
    this.#ticketPaymentService = ticketPaymentClass;
  };
  #makePayment(accountId) {
    this.#ticketPaymentService.makePayment(accountId, this.#getTotalAmountToPay());
  };

  #seatReservationService;
  #setSeatReservationService(seatReservationClass) {
    this.#seatReservationService = seatReservationClass;
  };
  #makeReservation(accountId) {
    this.#seatReservationService.reserveSeat(accountId, this.#getTotalSeatsToAllocate());
  };

  #validateAccountIdFormat(accountId) {
    if (accountId < 1 || !Number.isInteger(accountId)) {
      throw new TypeError("Account number is incorrect");
    };
  };

  #validateArguementFormat(ticketTypeRequest) {
    if (
      typeof ticketTypeRequest !== "object" ||
      Array.isArray(ticketTypeRequest) ||
      ticketTypeRequest === null
    ) {
      throw new InvalidPurchaseException(`ticketTypeRequests must be objects`);
    };
  };

  #ticketDetailChecker(accountId, ticketTypeRequests) {
    this.#validateAccountIdFormat(accountId);

    for (let ticketTypeRequest of ticketTypeRequests) {
      this.#validateArguementFormat(ticketTypeRequest);

      // this.#setTicketRequestInformation(new TicketTypeRequest(ticketTypeRequest.type, ticketTypeRequest.quantity));
      // this.#setNoOfTickets(this.#getTicketRequestionType(), this.#getTicketRequestionQuantity());

      // Instantiating the class
      const currentTicket = new TicketTypeRequest(ticketTypeRequest.type, ticketTypeRequest.quantity);
      this.#setNoOfTickets(currentTicket.getTicketType(), currentTicket.getNoOfTickets());
    };

    if (this.#getNoOfTicketType("ADULT") <= 0) {
      throw new InvalidPurchaseException("CHILD and INFANT tickets cannot be purchased without an accompanying ADULT.");
    } else if (this.#getNoOfTicketType("ADULT") * 2 < this.#getNoOfTicketType("INFANT")) {
      throw new InvalidPurchaseException("No more than 2 INFANTs per ADULT.")
    };

    this.#setTotalSeatsToAllocate(this.#getNoOfTicketType("ADULT") + this.#getNoOfTicketType("CHILD"));

    this.#setTotalAmountToPay((this.#getNoOfTicketType("ADULT") * 20) + (this.#getNoOfTicketType("CHILD") * 10));
    // this.#setTotalAmountToPay(this.#getNoOfTicketType("CHILD") * 10);

  };

  #paymentService(accountId) {
    this.#setTicketPaymentService(new TicketPaymentService());
    this.#makePayment(accountId);
  };

  #reservationService(accountId) {
    this.#setSeatReservationService(new SeatReservationService());
    this.#makeReservation(accountId);
  };

  #summary() {
    return {
      success: true,
      totalTickets: this.#getNoOfTickets(),
      totalCharged: this.#getTotalAmountToPay(),
      totalSeats: this.#getTotalSeatsToAllocate()
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#ticketDetailChecker(accountId, ticketTypeRequests);
    this.#paymentService(accountId);
    this.#reservationService(accountId);
    return this.#summary();
  }
}

const test = new TicketService();
// console.log(test.purchaseTickets(35641, ["ADULT", 5, "CHILD", 3]));
console.log(test.purchaseTickets(
  35641,
  { type: "ADULT", quantity: 5 },
  { type: "CHILD", quantity: 3 }
));
