import React, { Component } from "react";
import * as Service from "../../services/Index";
import * as Constans from "../../constants/Index";
import Switch from "react-switch";
export default class EditCategory extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.onchangeName = this.onchangeName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { id: id, data: {}, checked: false };
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  onchangeName(e) {
    this.setState({
      data: { name: e.target.value },
    });
  }

  onSubmit(e) {
    this.setState({
      isInSubmit: true,
    });
    e.preventDefault();
    const category = {
      name: this.state.data.name,
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
      Constans.CATEGORIA_SECTION + "/update/" + this.state.id,
      resolve,
      reject
    );
  }

  componentDidMount() {
    var url = Constans.CATEGORIA_SECTION + "/id?id=" + this.state.id;

    var resolve = (response) => {
      this.setState({
        data: response.data,
        loaded: true,
        title: response.data.name,
      });
    };
    var reject = (error) => {
      this.setState({
        data: [],
        loaded: true,
      });
    };
    Service.get(url, resolve, reject);
  }

  render() {
    if (this.state.loaded) {
      return (
        <div>
          <div className="  row jumbotron headerInList">
            <div className=" col-lg">
              <h3>Edição da Categoria</h3>
            </div>
          </div>
          <div className="containerSquare ">
            <div class="form-group row">
              <label className="col-sm-1 col-form-label">Editar</label>
              <div class="col-sm-5">
                <Switch
                  onChange={this.handleChange}
                  checked={this.state.checked}
                />
              </div>
            </div>
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
                      disabled={!this.state.checked}
                      value={this.state.data.name}
                      onChange={this.onchangeName}
                    ></input>
                  </div>
                </div>
              </div>
              <p>
                <h4 className="errorMessage">{this.state.errorMessage}</h4>
              </p>
              <label className={!this.state.checked ? "hideElem" : ""}>
                *Campos de preenchimento obrigatório
              </label>
              <div
                className={
                  !this.state.checked ? "form-group hideElem" : "form-group"
                }
              >
                <button type="submit" className="btn btn-success">
                  Criar
                </button>
              </div>
              <div
                className={
                  this.state.checked ? "form-group hideElem" : "form-group"
                }
              ></div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row jumbotron headerInList">
            <div className="col-lg">
              <h3>Edição da Categoria</h3>
            </div>
          </div>
          <div className="containerSquare text-center">
            <img src="/img/spinner.svg" alt="loading" />
          </div>
        </div>
      );
    }
  }
}
