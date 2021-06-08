import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import jwt from 'jwt-simple';
import $axios from './../utils/axios';

import './../assets/styles/Home.css';

const radios = [
  { name: 'Small (85x85)', value: '85' },
  { name: 'Medium (160x160)', value: '160' },
  { name: 'Large (250x250)', value: '250' },
];

class App extends Component {
  state = {
    loader: true,
  };

  componentDidMount() {
    this.getImages();
  }

  getImages = async() => {
    const { token } = this.props.match.params;
    const resp = await $axios.get(`images/${token}`);
    console.log('______ resp: ', resp)
  }

  setLoader = val => {
    this.setState({
      loader: val,
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
