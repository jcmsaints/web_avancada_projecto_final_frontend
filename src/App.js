import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//Firebase
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";
//Constants
import * as Constans from "./constants/Index";
//Components
import HomepageComponent from "./components/homepage/index.component";

import CategoryCreateComponent from "./components/category/create-category.component";
import CategoryEditComponent from "./components/category/edit-category.component";
import CategoryListComponent from "./components/category/list-category.component";

import ExpenseCreateComponent from "./components/expense/create-expense.component";
import ExpenseEditComponent from "./components/expense/edit-expense.component";
import ExpenseListComponent from "./components/expense/list-expense.component";
const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    if (!user) {
      return (
        <div className="loginDiv">
          <header>
            <nav className="navbar navbar-dark bg-dark">
              <div className="navbar-brand">
                <a href="/">
                  <img alt="" src="/img/logoSmall.png" className="imgFixSize" />
                </a>
              </div>
            </nav>
          </header>
          <main className="container-fluid main">
            <div className="backgroundWhite">
              <div>
                <div className="row jumbotron headerInList">
                  <div className="col-lg">
                    <h1>Login</h1>
                  </div>
                </div>
                <div className="containerSquare text-center">
                  <button
                    className="btn btn-secondary"
                    onClick={signInWithGoogle}
                  >
                    <i class="fab fa-google"></i> Log in com Google
                  </button>
                </div>
              </div>
            </div>
            <div className="fixed-bottom navbar navbar-dark bg-dark footer"></div>
          </main>
        </div>
      );
    } else {
      window.user = user;
      return (
        <Router>
          <header>
            <nav className="navbar navbar-dark bg-dark">
              <div className="navbar-brand">
                <a href="/">
                  <img alt="" src="/img/logoSmall.png" className="imgFixSize" />
                </a>
              </div>
              <button
                onClick={signOut}
                className="form-inline my-2 my-lg-0 color-white"
              >
                <i className="fas fa-sign-out-alt fa-2x"></i>
              </button>
            </nav>
          </header>
          <main className="container-fluid main">
            <div className="backgroundWhite">
              <Route
                path={Constans.HOMEPAGE_URL}
                exact
                component={HomepageComponent}
                params={user}
              />
              <Route
                exact
                path={Constans.DESPESA_URL}
                component={ExpenseListComponent}
                user={user}
              />
              <Route
                path={Constans.DESPESA_URL + Constans.CRIAR_URL}
                component={ExpenseCreateComponent}
                user={user}
              />
              <Route
                path={Constans.DESPESA_URL + Constans.EDITAR_URL}
                component={ExpenseEditComponent}
                user={user}
              />

              <Route
                exact
                path={Constans.CATEGORIA_URL}
                component={CategoryListComponent}
                user={user}
              />
              <Route
                path={Constans.CATEGORIA_URL + Constans.CRIAR_URL}
                component={CategoryCreateComponent}
              />
              <Route
                path={Constans.CATEGORIA_URL + Constans.EDITAR_URL}
                component={CategoryEditComponent}
                user={user}
              />
            </div>
            <div className="fixed-bottom navbar navbar-dark bg-dark footer">
              <a href="/" className="menuIcon text-center">
                <i className="fas fa-home fa-2x"></i>
              </a>
              <a href="/despesa" className="menuIcon text-center">
                <i class="far fa-list-alt fa-2x"></i>
              </a>
              <a href="/despesa/criar" className="menuIcon text-center">
                <i className="fas fa-plus fa-2x"></i>
              </a>
              <a href="/categoria" className="menuIcon text-center">
                <i class="fas fa-list-ol fa-2x"></i>
              </a>
            </div>
          </main>
        </Router>
      );
    }
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
