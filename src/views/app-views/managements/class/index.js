import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import ClassList from './ClassList'
import AddClass from './AddClass';
import ViewDetail from './ViewDetail';
import ViewAction from "./ViewAction";
import ImportClass from "./ImportClass";
import ExportClass from "./ExportClass";
import ClassRecycle from "./ClassRecycle";

const Class = props => {
  const { match } = props
	return (
		<Switch>
			<Route path={`${match.url}/class-list`} component={ClassList} />
			<Route path={`${match.url}/add-class`} component={AddClass} />
			<Route path={`${match.url}/view-detail/:id`} component={ViewDetail} />
			<Route path={`${match.url}/view-action`} component={ViewAction} />
			<Route path={`${match.url}/import-class`} component={ImportClass} />
			<Route path={`${match.url}/export-class`} component={ExportClass} />
			<Route path={`${match.url}/class-recycle`} component={ClassRecycle} />
			<Redirect exact from={`${match.url}`} to={`${match.url}/class-list`} />
		</Switch>
	)
}

export default Class