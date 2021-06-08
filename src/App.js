import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Download from './components/Download';

// css
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      <main>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/download/:token" component={Download} exact />
        </Switch>
      </main>
    </div>
  );
}

export default App;
