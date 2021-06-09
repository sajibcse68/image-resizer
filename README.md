# Image Resizer

Recording Demo:  
.  
![caption](./demo/image-resizer-demo.gif)


## The Work Flow

- Upload the image(s) and do api call with `jwt token` to server (client)
- Upload the images in S3 bucket (server)
- Push the `token` (message) to SQS (server)
- Get the `token` from SQS and retrieve the payload info (worker)
- Resize the image and upload the resized image in S3 again (worker)
- Do api call for resized image(s) to server (client)
- Retrieve the image(s) from S3 and send to client (server)
- Get the image(s) and ready for download (client)
- Done! 


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the client in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the client for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# Setup Server

### Config file
Create a `.env` file in the root directory of the project and add variables in the form of `NAME=VALUE`

```sh
ACCESS_KEY=<access_key>
SECRET_ACCESS_KEY=<secret_access_key>
```

### Run the Server

```sh
$ npm run server
```

### Run the Worker

```sh
$ npm run worker
```