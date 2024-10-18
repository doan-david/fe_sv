import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Managements = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match.url}/class`} component={lazy(() => import(`./class`))} />
      <Route path={`${match.url}/student`} component={lazy(() => import(`./student`))} />
      {/*<Route path={`${match.url}/demo`} component={lazy(() => import(`./demo`))} />*/}
      <Redirect from={`${match.url}`} to={`${match.url}/class`} />
    </Switch>
  </Suspense>
)};

export default Managements