import React, { Component } from "react";
import * as Constans from "../../constants/Index";
import Modal from "react-modal";
import * as Service from "../../services/Index";
export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.delete = this.deleteElem.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getModal = this.getModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.finalDelete = this.finalDelete.bind(this);
    this.state = {
      idSelected: "",
      showModal: false,
    };
  }
  deleteElem(id) {
    this.setState({
      idSelected: id,
      showModal: true,
    });
  }

  finalDelete() {
    var url = this.props.section + "/delete/" + this.state.idSelected;

    var resolve = (response) => {
      window.location.reload(false);
    };
    var reject = (error) => {};
    Service.get(url, resolve, reject);
    this.setState({
      idSelected: "",
      showModal: false,
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  getModal() {
    return (
      <div className="modal" tabindex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderRow(data) {
    return this.props.columns.map(
      function (column) {
        if (column.value === Constans.EDITAR_URL_SEM_ID) {
          return (
            <td>
              <a
                className="btn btn-primary"
                href={
                  "/" +
                  this.props.section +
                  Constans.EDITAR_URL_SEM_ID +
                  data._id
                }
              >
                <i className="fas fa-pencil-alt"></i>
              </a>
            </td>
          );
        }
        if (column.value === Constans.APAGAR_URL) {
          return (
            <td>
              <button
                className="btn btn-danger"
                onClick={() => this.deleteElem(data._id)}
              >
                <i className="far fa-trash-alt"></i>
              </button>
            </td>
          );
        } else {
          return <td>{data[column.value]}</td>;
        }
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              {this.props.columns.map((column, i) => {
                return <th>{column.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.data.data.map((data, i) => {
              return <tr>{this.renderRow(data)}</tr>;
            })}
          </tbody>
        </table>
        <div className="tableModal">
          <Modal
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            className="Modal"
          >
            <div className="modal-body">Deseja mesmo apagar a despesa?</div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={this.handleCloseModal}
                className="btn btn-success"
                data-dismiss="modal"
              >
                <i class="fas fa-times"></i> Cancelar
              </button>
              <button
                onClick={this.finalDelete}
                type="button"
                class="btn btn-danger mr-auto"
              >
                <i className="far fa-trash-alt"></i> Apagar
              </button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
