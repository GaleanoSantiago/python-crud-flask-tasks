// ----- Formulario dar de Alta----------
const form = document.getElementById('myForm');

form.addEventListener('submit',  (e) => {
    e.preventDefault(); // Evitar que la página se actualice
    enviarDatos();
    // console.log("enviado");
    form.reset(); // Resetear los valores de los inputs
});

const obtenerDatos = () => {
    fetch('http://localhost:5000/tareas')
        .then(response => response.json())
        .then(data => {
            mostrarDatosEnTabla(data);
            // console.log(data);
        })
        .catch(error => {
            console.log('Error al obtener las tareas:', error);
        });
}

const mostrarDatosEnTabla = (data) => {
    const bodyTable = document.getElementById("body-table");

    // Limpiar contenido existente en la tabla
    bodyTable.innerHTML = "";

    // Recorrer los datos y agregar filas a la tabla
    data.forEach(item => {
        const row = document.createElement("tr");

        // Crear celdas y asignar valores
        const idCell = document.createElement("td");
        idCell.textContent = item.codigo;
        // console.log(item.codigo);
        row.appendChild(idCell);

        const descripcionCell = document.createElement("td");
        descripcionCell.textContent = item.descripcion;
        row.appendChild(descripcionCell);

        const completadaCell = document.createElement("td");
        completadaCell.textContent = item.done ? "Si" : "No";
        row.appendChild(completadaCell);

        
        const formCell = document.createElement("td");
        const form = document.createElement("form");
        form.action = `http://localhost:5000/tareas/${item.codigo}`;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "tarea_id";
        input.value = item.codigo;
        form.appendChild(input);
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Borrar";
        submitButton.classList.add("btn");
        submitButton.classList.add("btn-danger");
        submitButton.classList.add("btn-delete");
        form.appendChild(submitButton);
        formCell.appendChild(form);
        row.appendChild(formCell);

        // Agregar la fila a la tabla
        bodyTable.appendChild(row);
    });

    // Agregar el evento de envío del formulario a los botones de borrado
    const btnDeleteList = document.querySelectorAll(".btn-delete");
    for (let i = 0; i < btnDeleteList.length; i++) {
        btnDeleteList[i].addEventListener("click", (event) => {
            event.preventDefault(); // Evitar el envío por defecto del formulario
            const form = event.target.closest("form");

            // Realizar la solicitud POST mediante Fetch
            fetch(form.action, {
                method: "POST",
                body: new FormData(form)
            })
            .then(response => {
                if (response.ok) {
                    console.log("Registro eliminado correctamente");
                    // Realizar alguna acción adicional si deseas
                } else {
                    console.error("Error al eliminar el registro");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
            });
            
        });
    }
}


const enviarDatos = () => {
    let descripcion = document.getElementById('descripcion').value;
    let done = document.getElementById('done').checked;

    let datos = {
        descripcion: descripcion,
        done: done
    };

    fetch('http://localhost:5000/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (response.ok) {
                console.log('Alta efectuada correctamente');
            } else {
                console.log('Error al dar de alta la tarea');
            }
            // alert("Ahora se recargara la pagina");
            
            

        })
        .catch(error => {
            console.log('Error en la solicitud:', error);
        });
}


obtenerDatos();