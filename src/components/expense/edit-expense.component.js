import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Service from "../../services/Index";
import * as Constants from "../../constants/Index";
import Switch from "react-switch";
export default class EditExpense extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.onchangeDate = this.onchangeDate.bind(this);
    this.onchangeDescription = this.onchangeDescription.bind(this);
    this.onchangeValue = this.onchangeValue.bind(this);
    this.onchangeCategoryId = this.onchangeCategoryId.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      id: id,
      checked: false,
      categoryList: [],
      data: {
        email: window.user.email,

        categoryId: "",
        categoryName: "",
        value: "",
        description: "",
        date: new Date(),
      },
      isInSubmit: false,
      errorMessage: "",
      loaded: false,
    };
  }
  handleChange(checked) {
    this.setState({ checked });
  }

  onchangeDate(e) {
    this.setState({
      date: e,
    });
  }

  onchangeDescription(e) {
    e.preventDefault();
    this.setState({
      description: e.target.value,
    });
  }

  onchangeValue(e) {
    e.preventDefault();
    this.setState({
      value: e.target.value,
    });
  }

  onchangeCategoryId(e) {
    var values = e.target.value.split("|");
    this.setState({
      categoryId: values[0],
      categoryName: values[1],
    });
  }

  resetForm(errorMsg) {
    this.setState({
      isInSubmit: false,
      errorMessage: errorMsg,
    });
  }

  onSubmit(e) {
    this.setState({
      isInSubmit: true,
    });
    e.preventDefault();
    const expense = {
      email: window.user.email,
      categoryId: this.state.categoryId,
      categoryName: this.state.categoryName,
      value: this.state.value,
      description: this.state.description,
      date: new Date(this.state.date),
    };

    var resolve = () => {
      window.location = "/despesa";
    };
    var reject = (error) => {
      this.resetForm("Erro ao Criar Despesa, tente novamente");
      console.log(error);
    };

    Service.post(
      expense,
      Constants.DESPESA_SECTION + "/update/" + this.state.id,
      resolve,
      reject
    );
  }

  componentDidMount() {
    var url = Constants.DESPESA_SECTION + "/id?id=" + this.state.id;

    var resolve = (response) => {
      response.data.date = Date.parse(response.data.date);
      debugger;
      this.setState({
        email: response.data.email,
        categoryId: response.data.categoryId,
        categoryName: response.data.categoryName,
        value: response.data.value,
        description: response.data.description,
        date: response.data.date,
        loaded: true,
      });
    };
    var reject = (error) => {
      this.setState({
        data: [],
        loaded: true,
      });
    };
    Service.get(url, resolve, reject);

    var url2 = Constants.CATEGORIA_SECTION + "?email=" + window.user.email;

    var resolve2 = (response) => {
      var result = response.data.map((item) => ({
        value: item._id,
        name: item.name,
      }));
      this.setState({
        categoryList: result,
        loaded: true,
      });
    };
    var reject2 = (error) => {
      this.setState({
        data: [],
        loaded: true,
      });
    };
    Service.get(url2, resolve2, reject2);
  }

  render() {
    if (this.state.isInSubmit || !this.state.loaded) {
      return (
        <div>
          <div className="row jumbotron">
            <div className="col-lg">
              <h1>Adicionar Despesa</h1>
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
          <div className="row headerInList">
            <div className="col-lg mt-2 ml-2">
              <h1>Editar Despesa</h1>
            </div>
          </div>
          <div className="containerSquare">
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
                    <label>Data(*)</label>
                    <div className="form-control no-border">
                      <DatePicker
                        disabled={!this.state.checked}
                        selected={this.state.date}
                        onChange={this.onchangeDate}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <label>Valor(*)</label>
                    <input
                      type="number"
                      name="value"
                      disabled={!this.state.checked}
                      className="form-control required"
                      id="expense"
                      placeholder="0.0"
                      value={this.state.value}
                      onChange={this.onchangeValue}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <label for="exampleFormControlTextarea1">Descrição</label>
                    <textarea
                      disabled={!this.state.checked}
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      value={this.state.description}
                      onChange={this.onchangeDescription}
                    ></textarea>
                  </div>

                  <div className="col">
                    <label>Tipo de Despesa(*)</label>
                    <select
                      disabled={!this.state.checked}
                      className="form-control"
                      onChange={this.onchangeCategoryId}
                      id="exampleFormControlSelect2"
                    >
                      {this.state.categoryList.map((category, i) => {
                        return (
                          <option
                            selected={this.state.categoryName == category.name}
                            value={category.value + "|" + category.name}
                          >
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <p>
                <h4 className="errorMessage">{this.state.errorMessage}</h4>
              </p>
              <label>*Campos de preenchimento obrigatório</label>
              <div
                className={
                  !this.state.checked ? "form-group hideElem" : "form-group"
                }
              >
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
