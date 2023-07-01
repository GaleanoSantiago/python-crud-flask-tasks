// ----- Formulario ----------
let form = document.getElementById('myForm');


form.addEventListener('submit',  (e) => {
    e.preventDefault(); // Evitar que la página se actualice
    enviarDatos();
    console.log("enviado");
    form.reset(); // Resetear los valores de los inputs
});


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
            alert("Ahora se recargara la pagina");
            
            

        })
        .catch(error => {
            console.log('Error en la solicitud:', error);
        });
}
