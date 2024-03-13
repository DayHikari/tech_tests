import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";

export default class TicketService {
  #noOfTickets;
  #getNoOfTickets() {
    return Object.values(this.#noOfTickets).reduce((a,b) => a + b, 0);
  };
  #getNoOfTicketType(ticketType) {
    return this.#noOfTickets[ticketType];
  };
  #setNoOfTickets(ticketType, value) {
    if (this.#getNoOfTickets() + value > 20) {
      throw new InvalidPurchaseException("Cannot purchase more than 20 tickets.")
    };

    this.#noOfTickets[ticketType] += value;
  };
  #resetNoOfTickets() {
    this.#noOfTickets = {
      "ADULT": 0,
      "CHILD": 0,
      "INFANT": 0,
    };
  };

  #ticketPaymentService;
  #setTicketPaymentService(ticketPaymentClass) {
    this.#ticketPaymentService = ticketPaymentClass;
  };
  #makePayment(accountId, amountToPay) {
    this.#ticketPaymentService.makePayment(accountId, amountToPay);
  };
  
  #seatReservationService;
  #setSeatReservationService(seatReservationClass) {
    this.#seatReservationService = seatReservationClass;
  };
  #makeReservation(accountId, noOfTickets) {
    this.#seatReservationService.reserveSeat(accountId, noOfTickets);
  };

  #resetVariableValues() {
    this.#resetNoOfTickets();
  };

  #validateAccountIdFormat(accountId) {
    if (accountId < 1 || !Number.isInteger(accountId)) {
      throw new InvalidPurchaseException("Account number is incorrect");
    };
  };

  #ticketDetailChecker(accountId, ticketTypeRequests) {
    this.#validateAccountIdFormat(accountId);
    
    this.#resetVariableValues();

    for (let ticketTypeRequest of ticketTypeRequests) {
      this.#setNoOfTickets(ticketTypeRequest.getTicketType(), ticketTypeRequest.getNoOfTickets());
    };

    if (this.#getNoOfTicketType("ADULT") <= 0) {
      throw new InvalidPurchaseException("CHILD and INFANT tickets cannot be purchased without an accompanying ADULT.");
    } else if (this.#getNoOfTicketType("ADULT") * 2 < this.#getNoOfTicketType("INFANT")) {
      throw new InvalidPurchaseException("No more than 2 INFANTs per ADULT.");
    };
  };

  #paymentService(accountId) {
    this.#setTicketPaymentService(new TicketPaymentService());
    this.#makePayment(accountId, (this.#getNoOfTicketType("ADULT") * 20) + (this.#getNoOfTicketType("CHILD") * 10));
  };

  #reservationService(accountId) {
    this.#setSeatReservationService(new SeatReservationService());
    this.#makeReservation(accountId, this.#getNoOfTicketType("ADULT") + this.#getNoOfTicketType("CHILD"));
  };

  #summary() {
    return {
      success: true,
      totalTickets: this.#getNoOfTickets(),
      totalCharged: (this.#getNoOfTicketType("ADULT") * 20) + (this.#getNoOfTicketType("CHILD") * 10),
      totalSeats: this.#getNoOfTicketType("ADULT") + this.#getNoOfTicketType("CHILD")
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#ticketDetailChecker(accountId, ticketTypeRequests);
    this.#paymentService(accountId);
    this.#reservationService(accountId);
    return this.#summary();
  };
};