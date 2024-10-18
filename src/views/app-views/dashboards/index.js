import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Dashboards = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
        {/* <Route path={`${match.url}/class`} component={lazy(() => import(`../managements/class`))} />
        <Redirect from={`${match.url}`} to={`${match.url}/class`} /> */}
    </Switch>
  </Suspense>
)};

export default Dashboards;