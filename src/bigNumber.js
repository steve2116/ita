/**
 * A way to use big numbers with being constrained to the limits of a number
 */
export class BigNumber {
  /**
   * base value for the big number
   */
  base = 1000000000;
  /**
   * An array of "digits", please do not touch
   */
  _internalValue = [0];
  /**
   * A boolean value that is true if the number is negative
   */
  negative = false;
  // /**
  //  * A constructor for a big number
  //  * @param {number | string | bigint | BigNumber} number default value is 0
  //  */
  /**
   * A constructor for a big number
   * @param {number} number default value is 0
   */
  constructor(number = 0) {
    // if (number instanceof BigNumber) {
    //   this._internalValue = number._internalValue.map((x) => x);
    //   this.negative = number.negative;
    // }
    if (typeof number === "number") {
      if (number < 0) {
        this.negative = true;
        number = -number;
      }
      for (let i = 0; number >= this.base; i++) {
        const remainder = number % this.base;
        number = Math.floor(number / this.base);
        this._internalValue[i] = remainder;
      }
      this._internalValue[this._internalValue.length] = number;
    }
  }

  toString() {
    let string = "";
    for (let i = 0; i < this._internalValue.length; i++) {
      const num = this._internalValue[i].toString();
      for (let j = num.length; j > 0; j -= 3) {
        string = num.slice(Math.max(j - 3, 0), j) + "," + string;
      }
    }
    return string.slice(0, string.length - 1);
  }
  valueOf() {
    return this.toString();
  }
}

export default BigNumber;
