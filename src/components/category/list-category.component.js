import React, { Component } from "react";
import DataTable from "../layout/table.component";
import * as Service from "../../services/Index";
import * as Constans from "../../constants/Index";
export default class ListCategory extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.getResults = this.getResults.bind(this);
    this.state = {
      data: [],
      loaded: false,
      columns: [
        {
          label: "Nome Categoria",
          value: "name",
        },
        {
          label: "Editar",
          value: Constans.EDITAR_URL_SEM_ID,
        },
        {
          label: "Apagar",
          value: Constans.APAGAR_URL,
        },
      ],
    };
  }

  getResults(page) {
    var url = Constans.CATEGORIA_SECTION + "?limit=4";
    if (page) {
      url += "&page=" + page;
    }
    url += "&email=" + window.user.email;
    var resolve = (response) => {
      this.setState({
        data: response,
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
  }

  componentDidMount() {
    this.getResults();
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
              <h1>Categorias</h1>
            </div>
          </div>
          <div className="containerSquare ">
            <a
              href={Constans.CATEGORIA_URL + Constans.CRIAR_URL}
              type="button"
              className="btn btn-success mb-2"
            >
              <i className="fas fa-plus"></i> Adicionar Categoria
            </a>
            <DataTable
              section={Constans.CATEGORIA_SECTION}
              columns={this.state.columns}
              data={this.state.data}
            />
            {this.getPagination()}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row jumbotron headerInList">
            <div className="col-lg">
              <h1>Categorias</h1>
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
