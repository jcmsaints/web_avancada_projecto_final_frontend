function generateTable() {
  $("#table").DataTable({
    scrollY: "300px",
    sScrollX: "100%",
    sScrollXInner: "100%",
    bScrollCollapse: true,
    scrollCollapse: true,
    paging: false,
    language: {
      search: "Pesquisa:",
      infoEmpty: "Sem resultados",
      info: "Total de _MAX_ Resultados",
      infoFiltered: "(filtrado de _MAX_ total)",
    },
  });
}
