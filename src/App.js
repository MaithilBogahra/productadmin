import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './Component/Layout/Layout'
import Product from './Container/Product/Product';


function App(props) {
  return (
    <div>
      <Layout>
        <Switch>
          <Route path={"/product"} exact component={Product} />
        </Switch>
      </Layout>

    </div>
  );
}

export default App;