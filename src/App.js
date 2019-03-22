import React, { Component } from 'react';
import logo from './logo.svg';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import csv from 'csv';
import { ButtonToolbar, Alert, Button } from 'react-bootstrap';
import 'mdbreact/dist/css/mdb.css';
import { Col, Container, Row, Footer } from 'mdbreact';

class App extends Component {

  constructor() {
    super()
    this.state = {
    }

    this.onReset = this.onReset.bind(this);
  }

  indexOfMax(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }

  onDropInvalid() {
    this.setState({ isInvalidFile: true });
  }

  onDrop(files) {

    this.setState({ files });

    var file = files[0];

    console.log(typeof file);

    var totalAmount = 0;
    var daysCount = [0, 0, 0, 0, 0, 0, 0];
    var totalHours = 0;
    var totalMinutes = 0;

    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (err, data) => {

        var guestList = [];

        for (var i = 1; i <= data.length; i++) {
          const id = data[i][0];
          const name = data[i][1];
          const newUser = { "id": id, "name": name };
          guestList.push(newUser);

          fetch('https://alweds.firebaseio.com/guests.json', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
          })
        };
      });
    };

    reader.readAsBinaryString(file);
  }

  onReset() {
    this.setState({ shouldShow: false });
    this.setState({ isInvalidFile: false });
  }

  render() {

    const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
    const fontSize = 5;

    if (this.state.isInvalidFile) {
      return (
        <div className="well" style={wellStyles}>
          <Alert bsStyle="danger"><strong>Unsupported File Format!</strong> You have uploaded an invalid file format!</Alert>
          <Button bsStyle="primary" bsSize="large" onClick={this.onReset} block>
            Try Again
          </Button>
        </div>
      );
    }

    else if (this.state.shouldShow) {
      return (
        <div align="center">
          <br /><br /><br />
          <section>
            <aside>
              <h2 className="heading">Your BlueSG Overview</h2>
              <ul>
                {
                  <h3 className="subheading">
                    You have spent a total amount of <font size={fontSize} color="#00A4FF">${this.state.amount}</font> on BlueSG. <br />
                    You have drove for a total of <font size={fontSize} color="#00A4FF">{this.state.totalHours} hours {this.state.totalMinutes} minutes</font>. <br />
                    You spent on average <font size={fontSize} color="#00A4FF">${this.state.averageAmount}</font> per day on BlueSG. <br />
                    You have driven mostly on <font size={fontSize} color="#00A4FF">{this.state.mostDrivenDay}s</font>. <br />
                  </h3>
                }
              </ul>
              <br />
              <div className="well" style={wellStyles}>
                <Button bsStyle="primary" bsSize="large" onClick={this.onReset} block>
                  Reset
                  </Button>
              </div>
            </aside>
          </section>
        </div>
      );
    } else {
      return (
        <div align="center" oncontextmenu="return false">
          <br /><br /><br />
          <div className="dropzone">
            <Dropzone accept=".csv" onDropAccepted={this.onDrop.bind(this)} onDropRejected={this.onDropInvalid.bind(this)}>
              <p>Upload Guest List</p>
            </Dropzone>
            <br /><br /><br />
          </div>
          <h2>Upload or drop your <font size={fontSize} color="#00A4FF">Guest</font> List in <br /> .CSV format above.</h2>
        </div>
      )
    }
  }
}

export default App;
