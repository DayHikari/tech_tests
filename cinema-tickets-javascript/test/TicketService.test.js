import TicketService from "../src/pairtest/TicketService";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";

describe("Testing library confirmation", () => {
  it("should always pass", () => {});
});

describe("Valid purchase requests", () => {
  it("should successfully purchase ADULT, CHILD and INFANT tickets only reserving ADULT and CHILD seats", () => {
    const ticketServiceRequest = new TicketService();
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      12344,
      { type: "ADULT", quantity: 5 },
      { type: "CHILD", quantity: 3 },
      { type: "INFANT", quantity: 4 }
    );
    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(12);
    expect(purchaseRequest.totalCharged).toBe(130);
    expect(purchaseRequest.totalSeats).toBe(8);
  });

  it("should successfully purchase ADULT, CHILD and INFANT tickets only reserving ADULT and CHILD seats when totalling 20 tickets", () => {
    const ticketServiceRequest = new TicketService();
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      12344,
      { type: "ADULT", quantity: 10 },
      { type: "CHILD", quantity: 5 },
      { type: "INFANT", quantity: 5 }
    );
    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(20);
    expect(purchaseRequest.totalCharged).toBe(250);
    expect(purchaseRequest.totalSeats).toBe(15);
  });

  it("should successfully purchase ADULT and CHILD tickets", () => {
    const ticketServiceRequest = new TicketService();
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      12344,
      { type: "ADULT", quantity: 5 },
      { type: "CHILD", quantity: 3 }
    );
    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(8);
    expect(purchaseRequest.totalCharged).toBe(130);
    expect(purchaseRequest.totalSeats).toBe(8);
  });

  it("should successfully purchase ADULT and INFANT tickets only reserving ADULT seats", () => {
    const ticketServiceRequest = new TicketService();
    const purchaseRequest = ticketServiceRequest.purchaseTickets(
      12344,
      { type: "ADULT", quantity: 5 },
      { type: "INFANT", quantity: 4 }
    );
    expect(purchaseRequest.success).toBe(true);
    expect(purchaseRequest.totalTickets).toBe(9);
    expect(purchaseRequest.totalCharged).toBe(100);
    expect(purchaseRequest.totalSeats).toBe(5);
  });
});

describe("Invalid purchase requests", () => {
  it("should throw an InvalidPurchaseException if no ADULT ticket purchased", () => {
    const childAndInfant = new TicketService();
    const justChild = new TicketService();
    const justInfant = new TicketService();

    expect(() =>
      childAndInfant.purchaseTickets(
        12344,
        {
          type: "CHILD",
          quantity: 3,
        },
        {
          type: "INFANT",
          quantity: 4,
        }
      )
    ).toThrow(InvalidPurchaseException && "CHILD and INFANT tickets cannot be purchased without an accompanying ADULT.");

    expect(() =>
      justChild.purchaseTickets(
        12344,
        {
          type: "CHILD",
          quantity: 3,
        },
        {
          type: "INFANT",
          quantity: 4,
        }
      )
    ).toThrow(InvalidPurchaseException && "CHILD and INFANT tickets cannot be purchased without an accompanying ADULT.");

    expect(() =>
      justInfant.purchaseTickets(
        12344,
        {
          type: "CHILD",
          quantity: 3,
        },
        {
          type: "INFANT",
          quantity: 4,
        }
      )
    ).toThrow(InvalidPurchaseException && "CHILD and INFANT tickets cannot be purchased without an accompanying ADULT.");


  });

  it("should throw an InvalidPurchaseException if there are more than 2 INFANTs per ADULT", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(
        12344,
        { type: "ADULT", quantity: 5 },
        { type: "INFANT", quantity: 11 }
      )
    ).toThrow(InvalidPurchaseException && "No more than 2 INFANTs per ADULT.");
  });

  it("should throw an InvalidPurchaseException if more than 20 tickets are requested", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(
        12344,
        { type: "ADULT", quantity: 10 },
        { type: "CHILD", quantity: 7 },
        { type: "INFANT", quantity: 4 }
      )
    ).toThrow(InvalidPurchaseException && "Cannot purchase more than 20 tickets.");
  });
});

describe("Account ID error handling", () => {
  it("should throw an InvalidPurchaseException if account ID is not an integer", () => {
    const ticketServiceRequest = new TicketService();

    expect(() => ticketServiceRequest.purchaseTickets(1.5)).toThrow(
      InvalidPurchaseException
    );

    expect(() => ticketServiceRequest.purchaseTickets(1.5)).toThrow(
      "Account number is incorrect"
    );
  });

  it("should throw an InvalidPurchaseException if account ID is zero", () => {
    const ticketServiceRequest = new TicketService();

    expect(() => ticketServiceRequest.purchaseTickets(0)).toThrow(
      InvalidPurchaseException
    );

    expect(() => ticketServiceRequest.purchaseTickets(0)).toThrow(
      "Account number is incorrect"
    );
  });

  it("should throw an InvalidPurchaseException if account ID is negative", () => {
    const ticketServiceRequest = new TicketService();

    expect(() => ticketServiceRequest.purchaseTickets(-1)).toThrow(
      InvalidPurchaseException
    );

    expect(() => ticketServiceRequest.purchaseTickets(-1)).toThrow(
      "Account number is incorrect"
    );
  });
});

describe("'ticketTypeRequest' argument type error handling", () => {
  it("should throw an InvalidPurchaseException if arguments are not objects", () => {
    const ticketServiceRequest = new TicketService();

    expect(() => ticketServiceRequest.purchaseTickets(12344, "Adult")).toThrow(
      InvalidPurchaseException
    );
    expect(() => ticketServiceRequest.purchaseTickets(12344, 5)).toThrow(
      InvalidPurchaseException
    );
    expect(() => ticketServiceRequest.purchaseTickets(12344, true)).toThrow(
      InvalidPurchaseException
    );
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, undefined)
    ).toThrow(InvalidPurchaseException);

    expect(() => ticketServiceRequest.purchaseTickets(12344, "Adult")).toThrow(
      "ticketTypeRequests must be objects"
    );
    expect(() => ticketServiceRequest.purchaseTickets(12344, 5)).toThrow(
      "ticketTypeRequests must be objects"
    );
    expect(() => ticketServiceRequest.purchaseTickets(12344, true)).toThrow(
      "ticketTypeRequests must be objects"
    );
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, undefined)
    ).toThrow("ticketTypeRequests must be objects");
  });

  it("should throw an InvalidPurchaseException if arguments are arrays", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, ["Adult", 5], ["Child", 3])
    ).toThrow(InvalidPurchaseException);

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, ["Adult", 5], ["Child", 3])
    ).toThrow("ticketTypeRequests must be objects");
  });

  it("should throw an InvalidPurchaseException if arguments are null", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, null, null)
    ).toThrow(InvalidPurchaseException);

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, null, null)
    ).toThrow("ticketTypeRequests must be objects");
  });
});

describe("TicketTypeRequest Class error handling", () => {
  it("should throw a TypeError if ticket type not ADULT, CHILD or INFANT", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADALT",
        quantity: 5,
      })
    ).toThrow(TypeError && `type must be ADULT, CHILD, or INFANT`);
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "CHALD",
        quantity: 3,
      })
    ).toThrow(TypeError && `type must be ADULT, CHILD, or INFANT`);
    expect(() =>
      ticketServiceRequest.purchaseTickets(
        12344,
        { type: "ADULT", quantity: 5 },
        { type: "INFINT", quantity: 1 }
      )
    ).toThrow(TypeError && `type must be ADULT, CHILD, or INFANT`);
  });

  it("should throw a TypeError is the noOfTickets is not an integer", () => {
    const ticketServiceRequest = new TicketService();

    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADULT",
        quantity: 5.5,
      })
    ).toThrow(TypeError && "noOfTickets must be an integer");
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADULT",
        quantity: "5",
      })
    ).toThrow(TypeError && "noOfTickets must be an integer");
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADULT",
        quantity: [5],
      })
    ).toThrow(TypeError && "noOfTickets must be an integer");
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADULT",
        quantity: null,
      })
    ).toThrow(TypeError && "noOfTickets must be an integer");
    expect(() =>
      ticketServiceRequest.purchaseTickets(12344, {
        type: "ADULT",
        quantity: undefined,
      })
    ).toThrow(TypeError && "noOfTickets must be an integer");
  });
});
