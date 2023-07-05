// ----- Formulario dar de Alta----------
const form = document.getElementById('myForm');
// ----- Boton para editar el contenido de la tarea -----
const btnEditForm = document.getElementById("btnEdit");

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
        const btnDone = document.createElement("button");
        btnDone.textContent = item.done ? "Completada" : "No Completada";
        btnDone.classList.add(item.done ? "btn-done" : "btn-dontDone");
        btnDone.classList.add("btnActualizar");
        btnDone.value= item.codigo;
        completadaCell.appendChild(btnDone);
        row.appendChild(completadaCell);


        const formCell = document.createElement("td");
        const form = document.createElement("form");
        form.action = `http://localhost:5000/tareas/${item.codigo}`;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "tarea_id";
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

        //Boton para editar
        const editCell = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.textContent="Editar";
        btnEdit.value= item.codigo;
        btnEdit.classList.add("btn");
        btnEdit.classList.add("btn-primary");
        btnEdit.classList.add("btn-edit");
        editCell.appendChild(btnEdit);
        row.appendChild(editCell);

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

    // Obtenemos los botones para actualizar el valor done de las tareas
    const btnDoneList = document.querySelectorAll(".btnActualizar");

    for (let i = 0; i < btnDoneList.length; i++) {
        btnDoneList[i].addEventListener("click", () => {
            // console.log(btnDoneList[i].value);
            
            // Objeto de configuración de la solicitud
            const options = {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) // Cuerpo vacío, ya que no se envían datos adicionales
            };
            // Realizar la solicitud PUT mediante Fetch
            fetch(`http://localhost:5000/tareas/${btnDoneList[i].value}`, options)
                .then(response => {
                    if (response.ok) {
                        console.log('Valor de done actualizado correctamente');
                    
                    } else {
                        console.error('Error al actualizar el valor de done');
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                });
        });
    }

    // Boton para Editar el contenido de la tarea
    const btnEditList = document.querySelectorAll(".btn-edit");
    for (let i = 0; i < btnEditList.length; i++) {
        btnEditList[i].addEventListener("click", ()=>{
            // console.log(data[i].codigo);
            // console.log(data[i].descripcion);
            // console.log(data[i].done);
            editarDatos(data[i]);
        })
    }

}

// Para mostrar los datos en el formulario de editar
const editarDatos = (item) =>{
    let descripcion = document.getElementById('descripcionEdit');
    let done = document.getElementById('doneEdit');
    let id = document.getElementById("idEdit");
    id.value=item.codigo;
    descripcion.value=item.descripcion;
    done.checked = item.done;
}

btnEditForm.addEventListener("click", ()=>{
    let id = document.getElementById("idEdit").value;
    let descripcion = document.getElementById('descripcionEdit').value;
    let done = document.getElementById('doneEdit').checked;
    // console.log(id);
    // console.log(done);
    const url = `http://localhost:5000/tareas/edit/${id}`;
    const data = {
        descripcion: descripcion,
        done: done
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Tarea modificada correctamente');
        } else {
            console.error('Error al modificar la tarea');
        }
    })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });

})
// funcion para enviar los datos
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