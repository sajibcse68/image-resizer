import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Spinner } from 'react-bootstrap';
import $axios from './../utils/axios';
import jwt from 'jwt-simple';

import './../assets/styles/Home.css';

let intervalId = null;
let count = 0;

class App extends Component {
  state = {
    loader: true,
    images: [],
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

    let hasAllImages = true;

    data.forEach((url) => {
      if (!url) hasAllImages = false;
    });

    // check if all images exists
    if (hasAllImages) {
      this.setState({
        loader: false,
        images: data,
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

  handleDownload = async ({ e, url, ind }) => {
    e.preventDefault();

    try {
      const { token } = this.props.match.params;
      const payload = jwt.decode(token, 'sajib', true);
      const { key, size, extensions, total } = payload;

      var a = document.createElement('a'); //Create <a>
      a.href = 'data:image/png;base64,' + url; // set href attr with base64 img
      a.download = `image-${ind + 1}.${extensions[ind]}`; // file name with extension
      a.click(); // download the image

    } catch (error) {
      console.log('error: ', error);
      debugger;
    }
  };

  render() {
    const { loader, images, error } = this.state;

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
      return <h1 style={{ display: 'flex', flexBasis: 'center'}}>Something went wrong. Please try again!</h1>;
    }

    return (
      <div className="home">
        <Styled.HomeLeft>
          <h1>Ready to Download</h1>

          {images.map((url, ind) => (
            <>
              <Button
                key={url}
                onClick={(e) => this.handleDownload({ e, url, ind })}
              >
                Download Image {ind + 1}{' '}
              </Button>
              <br />
            </>
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
