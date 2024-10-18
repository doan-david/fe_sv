import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Add from "./add";

const Demo = props => {
    const { match } = props
    return (
        <Switch>
            <Route path={`${match.url}/add`} component={Add} />
        </Switch>
    )
}

// export default Demo