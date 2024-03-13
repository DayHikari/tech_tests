import TicketService from "../src/pairtest/TicketService";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";

const validAccountNumber = 12344;

let ticketServiceRequest = new TicketService();

describe("Testing library confirmation", () => {
  it("should always pass", () => {});
});

describe("Valid purchase requests", () => {
  it("should successfully purchase ADULT, CHILD and INFANT tickets only reserving ADULT and CHILD seats", () => {
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      validAccountNumber,
      new TicketTypeRequest("ADULT", 5),
      new TicketTypeRequest("CHILD", 3),
      new TicketTypeRequest("INFANT", 4)
    );

    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(12);
    expect(purchaseRequest.totalCharged).toBe(130);
    expect(purchaseRequest.totalSeats).toBe(8);
  });

  it("should successfully purchase ADULT, CHILD and INFANT tickets only reserving ADULT and CHILD seats when totalling 20 tickets", () => {
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      validAccountNumber,
      new TicketTypeRequest("ADULT", 10),
      new TicketTypeRequest("CHILD", 5),
      new TicketTypeRequest("INFANT", 5)
    );

    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(20);
    expect(purchaseRequest.totalCharged).toBe(250);
    expect(purchaseRequest.totalSeats).toBe(15);
  });

  it("should successfully purchase ADULT and CHILD tickets", () => {
    const ticketServiceRequest = new TicketService();
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      validAccountNumber,
      new TicketTypeRequest("ADULT", 5),
      new TicketTypeRequest("CHILD", 3)
    );

    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(8);
    expect(purchaseRequest.totalCharged).toBe(130);
    expect(purchaseRequest.totalSeats).toBe(8);
  });

  it("should successfully purchase ADULT and INFANT tickets only reserving ADULT seats", () => {
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      validAccountNumber,
      new TicketTypeRequest("ADULT", 5),
      new TicketTypeRequest("INFANT", 4)
    );

    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(9);
    expect(purchaseRequest.totalCharged).toBe(100);
    expect(purchaseRequest.totalSeats).toBe(5);
  });
});

describe("Invalid purchase requests", () => {
  it("should throw an InvalidPurchaseException if no ADULT ticket purchased", () => {
    expect(() =>
      ticketServiceRequest.purchaseTickets(
        validAccountNumber,
        new TicketTypeRequest("CHILD", 3),
        new TicketTypeRequest("INFANT", 4)
      )
    ).toThrow(
      InvalidPurchaseException &&
        "CHILD and INFANT tickets cannot be purchased without an accompanying ADULT."
    );
  });

  it("should throw an InvalidPurchaseException if there are more than 2 INFANTs per ADULT", () => {
    expect(() =>
      ticketServiceRequest.purchaseTickets(
        validAccountNumber,
        new TicketTypeRequest("ADULT", 5),
        new TicketTypeRequest("INFANT", 11)
      )
    ).toThrow(InvalidPurchaseException && "No more than 2 INFANTs per ADULT.");
  });

  it("should throw an InvalidPurchaseException if more than 20 tickets are requested", () => {
    expect(() =>
      ticketServiceRequest.purchaseTickets(
        validAccountNumber,
        new TicketTypeRequest("ADULT", 10),
        new TicketTypeRequest("CHILD", 7),
        new TicketTypeRequest("INFANT", 4)
      )
    ).toThrow(
      InvalidPurchaseException && "Cannot purchase more than 20 tickets."
    );
  });
});

describe("Account ID error handling", () => {
  it("should throw an InvalidPurchaseException if account ID is not an integer", () => {
    expect(() => ticketServiceRequest.purchaseTickets(1.5)).toThrow(
      InvalidPurchaseException && "Account number is incorrect"
    );
  });

  it("should throw an InvalidPurchaseException if account ID is zero", () => {
    expect(() => ticketServiceRequest.purchaseTickets(0)).toThrow(
      InvalidPurchaseException && "Account number is incorrect"
    );
  });

  it("should throw an InvalidPurchaseException if account ID is negative", () => {
    expect(() => ticketServiceRequest.purchaseTickets(-1)).toThrow(
      InvalidPurchaseException && "Account number is incorrect"
    );
  });
});

describe("TicketTypeRequest Class error handling", () => {
  it("should throw a TypeError if ticket type not ADULT, CHILD or INFANT", () => {
    expect(() => new TicketTypeRequest("ADALT", 5)).toThrow(
      TypeError && `type must be ADULT, CHILD, or INFANT`
    );
    expect(() => new TicketTypeRequest("CHALD", 4)).toThrow(
      TypeError && `type must be ADULT, CHILD, or INFANT`
    );
    expect(() => new TicketTypeRequest("INFINT", 1)).toThrow(
      TypeError && `type must be ADULT, CHILD, or INFANT`
    );
  });

  it("should throw a TypeError is the noOfTickets is not an integer", () => {
    expect(() => new TicketTypeRequest("ADULT", 5.5)).toThrow(
      TypeError && "noOfTickets must be an integer"
    );

    expect(() => new TicketTypeRequest("ADULT", "5")).toThrow(
      TypeError && "noOfTickets must be an integer"
    );
    expect(() => new TicketTypeRequest("ADULT", [5])).toThrow(
      TypeError && "noOfTickets must be an integer"
    );

    expect(() => new TicketTypeRequest("ADULT", null)).toThrow(
      TypeError && "noOfTickets must be an integer"
    );

    expect(() => new TicketTypeRequest("ADULT", undefined)).toThrow(
      TypeError && "noOfTickets must be an integer"
    );
  });
});