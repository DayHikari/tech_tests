export default class InvalidPurchaseException extends Error {
  constructor(message) {
    super(`Invalid purchase error: ${message}`);
    this.name = "InvalidPurchaseException";
  };
};