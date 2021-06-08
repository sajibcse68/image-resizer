import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Spinner } from 'react-bootstrap';
import $axios from './../utils/axios';

import './../assets/styles/Home.css';

const radios = [
  { name: 'Small (85x85)', value: '85' },
  { name: 'Medium (160x160)', value: '160' },
  { name: 'Large (250x250)', value: '250' },
];

let intervalId = null;
let count = 0;

class App extends Component {
  state = {
    loader: true,
    imageUrls: [],
    error: false,
  };

  componentDidMount() {
    intervalId = setInterval(this.getImages, 2500);
  }

  getImages = async () => {
    const { token } = this.props.match.params;
    const resp = await $axios.get(`images/${token}`);
    const data = (resp?.data && Object.values(resp.data)) || [];

    // count the try, at most 5 try
    count++;
    console.log('>>> count: ', count);

    let hasAllUrls = true;

    data.forEach((url) => {
      if (!url) hasAllUrls = false;
    });

    if (hasAllUrls) {
      this.setState({
        loader: false,
        imageUrls: data,
      });

      clearInterval(intervalId);
    } else if (count > 5) {
      clearInterval(intervalId);
      this.setState({
        loader: false,
        error: true,
      });
    }
  };

  setLoader = (val) => {
    this.setState({
      loader: val,
    });
  };

  render() {
    const { loader, imageUrls, error } = this.state;

    if (loader) {
      return (
        <Styled.SpinnerWrap>
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Resizing...
          </Button>
        </Styled.SpinnerWrap>
      );
    }

    if (error) {
      return <h1>Something went wrong. Please try again!</h1>;
    }

    return (
      <div className="home">
        <Styled.HomeLeft>
          <h1>Resize IMAGE</h1>
          <h3>Resize JPG, PNG by defining new height and width pixels.</h3>

          {imageUrls.map((url, index) => (
            <a href={url} download={url} target="_blank">
              Download Image {index + 1}{' '}
            </a>
          ))}
          <Styled.UploaderWrap></Styled.UploaderWrap>
        </Styled.HomeLeft>

        <Styled.HomeRight></Styled.HomeRight>
      </div>
    );
  }
}

export default App;

const Styled = {};

Styled.SpinnerWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

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
