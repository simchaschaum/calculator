import React from 'react';
import './../src/App.css'

let number = [];
let ans;
var oldAns;
var numVar;
var oldNum;
var opSymbol;
let decimalCal = 1;
const numKeys = [
  {
    name: "nine",
    number: 9
  },
  {
    name: "eight",
    number: 8
  },
  {
    name: "seven",
    number: 7
  },
  {
    name: "six",
    number: 6
  },
  {
    name: "five",
    number: 5
  },
  {
    name: "four",
    number: 4
  },
  {
    name: "three",
    number: 3
  },
  {
    name: "two",
    number: 2
  },
  {
    name: "one",
    number: 1
  },
  {
    name: "zero",
    number: 0
  }
];

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num1: 0,
      num2: 0,
      operation: "",
      answer: 0,
      display: 0,
      display2: "",
      decimal: false,
      end: false,
      negative: false
    };
    this.calculate = this.calculate.bind(this);
    this.addOperation = this.addOperation.bind(this);
    this.addDecimal = this.addDecimal.bind(this);
    this.addZero = this.addZero.bind(this);
    this.symbol = this.symbol.bind(this);
  }

  symbol(e) {
    switch (e) {
      case "":
        opSymbol = "";
        break;
      case "add":
        opSymbol = " + ";
        break;
      case "subtract":
        opSymbol = " - ";
        break;
      case "multiply":
        opSymbol = " \u00d7 ";
        break;
      default:
        opSymbol = " \u00f7 ";
        break;
    }
  }

  /*  Calculation - all 4 operations:
use variable 'ans'
use num1 and num2
reset: number array, decimal state, reset all states; do not reset num2.
*/
  calculate() {
    if (this.state.num2) {
      //only allow 'equals' sign to work if there's num2
      switch (this.state.operation) {
        case "add":
          ans = this.state.num1 + this.state.num2;
          break;
        case "subtract":
          ans = this.state.num1 - this.state.num2;
          break;
        case "multiply":
          ans = this.state.num1 * this.state.num2;
          break;
        default:
          ans = this.state.num1 / this.state.num2;
          break;
      }
      this.symbol(this.state.operation);
      // put numbers in the proper states:
      this.setState({
        answer: ans,
        num1: ans,
        display: ans
      });
      // reset for the next number:
      number.length = 0;
      this.setState({ decimal: false, negative: false });
      decimalCal = 1;
    }
  }

  addOperation(op, opSymbol) {
    //  adding a negative
    if (op == "subtract") {
      if (
        (this.state.operation == "" && this.state.num1 == 0) ||
        (this.state.operation != "" &&
          this.state.num1 != 0 &&
          this.state.num2 == 0)
      ) {
        //nothing yet - make it negative
        if (this.state.negative == false) {
          this.setState({ negative: true });
        } else {
          this.setState({ negative: false });
        }
      }
      if (this.state.operation == "" && this.state.num1 != 0) {
        this.setState({
          operation: op,
          decimal: false,
          negative: false,
          display2: oldNum + " - "
        });
        number.length = 0;
        decimalCal = 1;
      }
      if (
        this.state.operation != "" &&
        this.state.num1 != 0 &&
        this.state.num2 != 0
      ) {
        if (this.state.end == true) {
          this.setState({
            operation: op,
            decimal: false,
            negative: false,
            end: false,
            display2: ans + " - "
          });
          number.length = 0;
          decimalCal = 1;
        } else {
          this.setState({ operation: op });
          this.calculate();
          oldNum = ans;
          this.setState({ display2: oldNum + opSymbol });
        }
      }
    } else {
      //  adding operator other than "subtract"
      if (this.state.num1 != 0) {
        //only do anything if there's num1 already
        if (this.state.num2 != 0) {
          //if there's num1 and num2
          if (this.state.end == false) {
            // if you have not hit equals yet, hitting an operator will calculate
            this.calculate();
            oldNum = ans;
            this.setState({ display2: oldNum + opSymbol });
          } else {
            // if you did hit equals, now turn off end:true so the next number entered won't reset everything
            this.setState({
              operation: op,
              decimal: false,
              negative: false,
              end: false,
              display2: ans + opSymbol
            });
          }
          this.setState({ operation: op, num2: 0 });
        } else {
          //         if only have num1 - the "regular" case:
          this.symbol(op);
          this.setState({ display2: oldNum + opSymbol });
        }
        this.setState({ operation: op, decimal: false, negative: false });
        number.length = 0;
        decimalCal = 1;
      }
    }
  }

  // temporarily adds a decimal as a string, to show that a decimal was pressed
  addDecimal() {
    if (this.state.operation !== "" && this.state.num2 === 0) {
      numVar = 0;
    }
    numVar = numVar.toFixed(0) + ".";
    this.setState({ display: numVar });
    oldNum = numVar;
  }
  // In case there's a decimal showing as a string (e.g. "0.") and another zero is pressed, it'll be added to the string instead of a number - so it'll be displayed until a number is added.
  addZero() {
    numVar = numVar + "0";
    this.setState({ display: numVar });
    oldNum = numVar;
  }

  render() {
    //  All number keys, including function for adding numbers:
    const nums = numKeys.map((item) => (
      <div
        class="keys numKeys"
        id={item.name}
        onClick={() => {
          // Decimal:
          if (this.state.decimal == true) {
            decimalCal = decimalCal * 10;
          }
          // if it's a zero added to a decimal, keep it as a string so it shows up in the display:
          if (item.number === 0 && typeof numVar == "string") {
            this.addZero();
          } else {
            // adding numbers - first to array, then variable, then setState for either num1 or num2;
            number.push(item.number);
            numVar = Number(number.join("")) / decimalCal;
            if (this.state.negative === true) {
              numVar = -numVar;
            }
            //Where does the number go?
            if (this.state.operation === "") {
              //no operation yet - it's num1
              this.setState({ num1: numVar, display: numVar });
              oldNum = numVar;
            } else {
              // operation stated - it's num2
              if (this.state.end === false) {
                // have not hit '=' to calculate
                this.setState({
                  num2: numVar,
                  display: numVar
                });
                this.symbol(this.state.operation);
                if (this.state.answer !== 0) {
                  oldNum = this.state.answer;
                }
                this.setState({ display2: oldNum + opSymbol + numVar });
              } else {
                // if it's already been completed, the new number resets everything.
                this.setState({
                  num1: numVar,
                  num2: 0,
                  answer: 0,
                  decimal: false,
                  operation: "",
                  display: numVar,
                  end: false,
                  negative: false,
                  display2: ""
                });
                oldNum = numVar;
                number.length = 0;
                numVar = 0;
              }
            }
          }
        }}
      >
        {item.number}
      </div>
    ));

    return (
      <div id="container">
        <div id="fullDisplay">
          <div id="display2">{this.state.display2}</div>
          <div id="display">{this.state.display}</div>
        </div>
        <div id="KeyContainer">
          {nums}

          {/*decimals:*/}
          <div
            class="keys"
            id="decimal"
            onClick={() => {
              if (this.state.decimal === false) {
                this.setState({ decimal: true });
                this.addDecimal();
              }
            }}
          >
            {" "}
            .{" "}
          </div>

          {/*Clear button:*/}
          <div
            class="keys"
            id="clear"
            onClick={() => {
              this.setState({
                answer: 0,
                operation: "",
                num1: 0,
                num2: 0,
                display: 0,
                display2: "",
                decimal: false,
                end: false,
                negative: false,
                secDisplay: ""
              });
              number.length = 0;
              numVar = 0;
              decimalCal = 1;
            }}
          >
            {" "}
            AC{" "}
          </div>

          {/*Operation(=) keys:
   Addition:*/}
          <div
            class="keys"
            id="add"
            onClick={() => {
              this.addOperation("add", " + ");
            }}
          >
            <i class="fas fa-plus"></i>
          </div>

          {/*Subtract:*/}
          <div
            class="keys"
            id="subtract"
            onClick={() => {
              this.addOperation("subtract", " - ");
            }}
          >
            <i class="fas fa-minus"></i>
          </div>

          {/*Multiply:*/}
          <div
            class="keys"
            id="multiply"
            onClick={() => {
              this.addOperation("multiply", " \u00d7 ");
            }}
          >
            <i class="fas fa-times"></i>
          </div>
          {/*Divide:*/}
          <div
            class="keys"
            id="divide"
            onClick={() => {
              this.addOperation("divide", " \u00f7 ");
            }}
          >
            <i class="fas fa-divide"></i>
          </div>

          {/*Calculate/Equal(=) key:*/}
          <div
            class="keys"
            id="equals"
            onClick={() => {
              this.setState({ end: true });
              if (this.state.answer != 0) {
                oldAns = ans; //**
              }
              this.calculate();
              if (this.state.end == false) {
                this.setState({ display2: oldNum + opSymbol + numVar + " = " });
              } else {
                this.setState({ display2: oldAns + opSymbol + numVar + " = " });
              }
            }}
          >
            {" "}
            ={" "}
          </div>
        </div>{" "}
        {/*end of #KeyContainer*/}
      </div>
    );
  }
}

export default Calculator;

