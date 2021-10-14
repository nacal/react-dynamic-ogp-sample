import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import { Top }  from "./pages/Top"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route path="/" exact component={Top} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
