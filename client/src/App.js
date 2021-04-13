import React, {Fragment} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
// import classes from './App.module.scss';
import { connect } from 'react-redux';
import Auth from './routes/Auth/Auth';
import Layout from './routes/Layout/Layout';
import * as actionsTypes from './store/actions/index';

const App = (props) => {
	let routes = (
		<Switch>
			<Route path="/" exact  render={() => <Auth mode="signIn"/>}/>
			<Route path="/register" exact  render={() => <Auth mode="register"/>}/>
			<Redirect to="/" />
		</Switch>
	);
	/* if not auth - guard */
	if(props.isAuthenticated){
		routes = (
			<Switch>
				<Route path="/" render={() => <Layout/>}/>
				<Redirect to="/" />
			</Switch>
		);
	};

	return (
		<Fragment>
			{routes}
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actionsTypes.authCheckState())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);