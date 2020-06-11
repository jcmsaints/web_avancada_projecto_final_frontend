import React, { Component } from "react";
import * as Service from "../../services/Index";
import * as Constants from "../../constants/Index";
export default class CreateCategory extends Component {
  constructor(props) {
    super(props);

    this.onchangeName = this.onchangeName.bind(this);

    this.state = {
      name: "",
      email: window.user.email,
      isInSubmit: false,
      errorMessage: "",
    };
  }

  onchangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  resetForm(errorMsg) {
    this.onchangeName = this.onchangeName.bind(this);

    this.setState({
      name: "",
      email: window.user.email,
      isInSubmit: false,
      errorMessage: errorMsg,
    });
  }

  onSubmit(e) {
    this.setState({
      isInSubmit: true,
    });
    e.preventDefault();
    const category = {
      name: this.state.name,
      email: window.user.email,
    };
    var resolve = () => {
      window.location = "/categoria";
    };
    var reject = (error) => {
      this.resetForm("Erro ao Criar Categoria, tente novamente");
      console.log(error);
    };

    Service.post(
      category,
      Constants.CATEGORIA_SECTION + "/add",
      resolve,
      reject
    );
  }

  render() {
    if (this.state.isInSubmit) {
      return (
        <div>
          <div className="row jumbotron">
            <div className="col-lg">
              <h1>Criar Categoria</h1>
            </div>
          </div>
          <div className="containerSquare text-center">
            <img src="/img/spinner.svg" alt="loading" />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row jumbotron">
            <div className="col-lg">
              <h1>Criar Categoria</h1>
            </div>
          </div>
          <div className="containerSquare">
            <form onSubmit={this.onSubmit.bind(this)}>
              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <label>Nome(*)</label>
                    <input
                      type="text"
                      name="value"
                      className="form-control required"
                      id="expense"
                      placeholder="Nome"
                      value={this.state.name}
                      onChange={this.onchangeName}
                    ></input>
                  </div>
                </div>
              </div>
              <p>
                <h4 className="errorMessage">{this.state.errorMessage}</h4>
              </p>
              <label>*Campos de preenchimento obrigatório</label>
              <div className="form-group">
                <button type="submit" className="btn btn-success">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}
