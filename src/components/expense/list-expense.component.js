import React, { Component } from "react";
import DataTable from "../layout/table.component";
import * as Service from "../../services/Index";
import * as Constants from "../../constants/Index";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
export default class ListExpense extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.getResults = this.getResults.bind(this);
    this.openFilterAndSort = this.openFilterAndSort.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onFilterByCat = this.onFilterByCat.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onBeginDateChange = this.onBeginDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    var date = new Date();
    this.state = {
      data: { data: [] },
      loaded: false,
      showModal: false,
      categoryList: [],
      catFilter: "",
      sortValue: "date_1",
      sortList: [
        { name: "Valor (Asc.)", value: "value_1" },
        { name: "Valor (Desc.)", value: "value_-1" },
        { name: "Data (Asc.)", value: "date_1" },
        { name: "Data (Desc.)", value: "date_-1" },
      ],
      beginDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      columns: [
        {
          label: "Despesa",
          value: "categoryName",
        },
        {
          label: "Valor",
          value: "value",
        },
        {
          label: "Descrição",
          value: "description",
        },
        {
          label: "Data",
          value: "date",
        },
        {
          label: "Editar",
          value: Constants.EDITAR_URL_SEM_ID,
        },
        {
          label: "Apagar",
          value: Constants.APAGAR_URL,
        },
      ],
    };
  }

  onBeginDateChange(e) {
    this.setState({
      beginDate: e,
    });
  }

  onEndDateChange(e) {
    this.setState({
      endDate: e,
    });
  }

  onSortChange(e) {
    this.setState({
      sortValue: e.target.value,
    });
  }

  onFilterByCat(e) {
    this.setState({
      catFilter: e.target.value,
    });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  openFilterAndSort() {
    this.setState({
      showModal: true,
    });
  }

  getResults(page) {
    var url =
      Constants.DESPESA_SECTION +
      "?limit=4&startDate=" +
      this.state.beginDate +
      "&endDate=" +
      this.state.endDate;
    if (page) {
      url += "&page=" + page;
    }
    if (this.state.catFilter) {
      url += "&filterByCat=" + this.state.catFilter;
    }
    url += "&sort=" + this.state.sortValue;
    url += "&email=" + window.user.email;
    var resolve = (response) => {
      this.setState({
        data: response,
        loaded: true,
        showModal: false,
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

  componentDidMount() {
    this.getResults();
    var url = Constants.CATEGORIA_SECTION;
    url += "&email=" + window.user.email;
    var resolve = (response) => {
      if (response.data) {
        var result = response.data.map((item) => ({
          value: item._id,
          name: item.name,
        }));

        this.setState({
          categoryList: result,
          loaded: true,
        });
        console.log(result);
      }
    };
    var reject = (error) => {
      this.setState({
        data: { data: [] },
        loaded: true,
      });
    };
    Service.get(url, resolve, reject);
  }

  nextPage(page) {
    this.setState({
      loaded: false,
    });
    this.getResults(page);
  }

  previousPage(page) {
    this.setState({
      loaded: false,
    });
    this.getResults(page);
  }

  getPagination() {
    var totalPages = Number(this.state.data.totalPages);
    var currentPage = Number(this.state.data.currentPage);

    if (totalPages > 1) {
      return (
        <nav>
          <ul className="pagination">
            <li className={"page-item " + (currentPage == 1 ? "disabled" : "")}>
              <button
                type="button"
                onClick={() => this.previousPage(currentPage - 1)}
                className=" btn page-link"
              >
                Anterior
              </button>
            </li>
            <li
              className={
                "page-item " + (currentPage == totalPages ? "disabled" : "")
              }
            >
              <button
                type="button"
                onClick={() => this.nextPage(currentPage + 1)}
                className=" btn page-link"
              >
                Próxima
              </button>
            </li>
          </ul>
        </nav>
      );
    }
  }

  render() {
    if (this.state.loaded) {
      return (
        <div>
          <div className="row headerInList">
            <div className="col-lg mt-2 ml-2">
              <h1>Despesas</h1>
            </div>
          </div>
          <div className="containerSquare ">
            <div
              className="btn-group  mb-2"
              role="group"
              aria-label="Basic example"
            >
              <a
                href={Constants.DESPESA_URL + Constants.CRIAR_URL}
                type="button"
                className="btn btn-success"
              >
                <i className="fas fa-plus"></i> Adicionar Despesa
              </a>
              <button
                onClick={() => this.openFilterAndSort()}
                className="ml-2 btn btn-primary"
              >
                {" "}
                <i className="fas fa-filter"></i> Filtros e ordenação
              </button>
            </div>
            <div className="table-responsive">
              <DataTable
                section={Constants.DESPESA_SECTION}
                columns={this.state.columns}
                data={this.state.data}
              />
            </div>
            {this.getPagination()}
            <Modal
              isOpen={this.state.showModal}
              contentLabel="Minimal Modal Example"
              className="ModalFilter"
            >
              <div className="modal-body">
                <div className="form-group">
                  <div className="row">
                    <div className="col">
                      <label>Desde(*)</label>
                      <div className="form-control no-border">
                        <DatePicker
                          selected={this.state.beginDate}
                          onChange={this.onBeginDateChange}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>Até(*)</label>
                      <div className="form-control no-border">
                        <DatePicker
                          selected={this.state.endDate}
                          onChange={this.onEndDateChange}
                          dateFormat="dd/MM/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>Categoria de Despesa</label>
                      <select
                        className="form-control"
                        onChange={this.onFilterByCat}
                        id="exampleFormControlSelect2"
                      >
                        <option value=""></option>
                        {this.state.categoryList.map((category, i) => {
                          return (
                            <option
                              selected={this.state.catFilter == category.value}
                              value={category.value}
                            >
                              {category.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>Ordenar por</label>
                      <select
                        className="form-control"
                        onChange={this.onSortChange}
                      >
                        {this.state.sortList.map((sort, i) => {
                          return (
                            <option
                              value={sort.value}
                              selected={this.state.sortValue == sort.value}
                            >
                              {sort.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={this.handleCloseModal}
                  className="btn btn-success"
                  data-dismiss="modal"
                >
                  <i className="fas fa-times"></i> Cancelar
                </button>
                <button
                  onClick={() => this.getResults()}
                  type="button"
                  className="btn btn-primary mr-auto"
                >
                  <i className="fas fa-filter"></i> Filtrar
                </button>
              </div>
            </Modal>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row jumbotron headerInList">
            <div className="col-lg">
              <h1>Despesas</h1>
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
