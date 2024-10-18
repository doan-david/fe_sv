import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import ViewDetail from './ViewDetail';
import ViewAction from './ViewAction';
import ImportStudent from "./ImportStudent";
import ExportStudent from "./ExportStudent";
import StudentRecycle from "./StudentRecycle";

const Student = props => {
  const { match } = props
	return (
		<Switch>
            <Route path={`${match.url}/student-list`} component={StudentList} />
			<Route path={`${match.url}/add-student`} component={AddStudent} />
			<Route path={`${match.url}/view-detail/:id`} component={ViewDetail} />
			<Route path={`${match.url}/view-action`} component={ViewAction} />
			<Route path={`${match.url}/import-student`} component={ImportStudent} />
			<Route path={`${match.url}/export-student`} component={ExportStudent} />
			<Route path={`${match.url}/recycle-student`} component={StudentRecycle} />
			<Redirect exact from={`${match.url}`} to={`${match.url}/student-list`} />
		</Switch>
	)
}

export default Student