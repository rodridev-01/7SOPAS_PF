window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

    // SIDEBAR
    const sidebar = document.getElementById("sidebar");

    document.getElementById("btnOpenSidebar")
      .addEventListener("click", () => {
        sidebar.classList.add("show");
      });

    document.getElementById("btnCloseSidebar")
      .addEventListener("click", () => {
        sidebar.classList.remove("show");
      });

    // CHARTS
    new Chart(document.getElementById("chartPedidos"), {
      type: "bar",
      data: {
        labels: ["Pendientes", "Preparando", "Entregados"],
        datasets: [{
          label: "Pedidos",
          data: [12, 8, 20],
          borderWidth: 1
        }]
      }
    });

    new Chart(document.getElementById("chartReservas"), {
      type: "doughnut",
      data: {
        labels: ["Confirmadas", "Pendientes"],
        datasets: [{
          data: [18, 6]
        }]
      }
    });
