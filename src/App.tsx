import { BrowserRouter, Route } from 'react-router-dom'
import { Top } from "./pages/Top"
import { Detail } from "./pages/Detail"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route path="/" exact component={Top} />
          <Route path="/detail/:id" exact component={Detail} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
