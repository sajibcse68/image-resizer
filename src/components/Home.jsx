import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

import './../assets/styles/Home.css';

const radios = [
  { name: '25% smaller', value: '25' },
  { name: '50% smaller', value: '50' },
  { name: '75% smaller', value: '75' },
];

class App extends Component {
  state = {
    selectedFiles: null,
    smallerVal: '25',
  };

  // file select (from the pop up)
  onFileChange = (event) => {
    this.setState({ selectedFiles: event.target.files });
  };

  // clicking on the resize button
  onFileUpload = () => {
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    const { selectedFiles } = this.state;

    if (selectedFiles?.length) {
      return Object.values(selectedFiles).map((file) => {
        return (
          <div>
            <h2>File Details:</h2>
            <p>File Name: {file.name}</p>
            <p>File Type: {file.type}</p>
            <p>Last Modified: {file.lastModifiedDate.toDateString()}</p>
          </div>
        );
      });
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  setSmallerValue = (val) => {
    this.setState({
      smallerVal: val,
    });
  };

  render() {
    const { smallerVal } = this.state;

    return (
      <div className="home">
        <Styled.HomeLeft>
          <h1>Resize IMAGE</h1>
          <h3>Resize JPG, PNG by defining new height and width pixels.</h3>
          <Styled.UploaderWrap>
            <Styled.InputWrap>
              <input type="file" multiple onChange={this.onFileChange} />
              Select Images
            </Styled.InputWrap>
          </Styled.UploaderWrap>

          {this.fileData()}
        </Styled.HomeLeft>

        <Styled.HomeRight>
          <ButtonGroup toggle>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                variant="secondary"
                name="radio"
                value={radio.value}
                checked={smallerVal === radio.value}
                onChange={(e) => this.setSmallerValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
          <Styled.ResizeBtnWrap>
            <Button
              variant="primary"
              size="lg"
              block
              onClick={this.onFileUpload}
            >
              Resize!
            </Button>
          </Styled.ResizeBtnWrap>
        </Styled.HomeRight>
      </div>
    );
  }
}

export default App;

const Styled = {};

Styled.HomeLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

Styled.HomeRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-basis: 35%;
`;

Styled.UploaderWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

Styled.InputWrap = styled.label`
  border: 1px solid #ccc;
  // display: inline-block;
  padding: 26px 70px;
  cursor: pointer;
  color: #fff;
  background-color: #0fa894;
  border-radius: 10px;

  &:hover {
    background-color: #000;
  }
`;

Styled.ResizeBtnWrap = styled.div`
  margin-top: 30px;
`;
