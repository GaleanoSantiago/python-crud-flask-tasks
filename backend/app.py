#-------------------------------------------- 
# Crud de Tareas
# --------------------------------------------

import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

# Nombre del objeto flask.
app = Flask(__name__)
CORS(app)

# Nombre del archivo que contiene la base de datos.
DATABASE = 'F:/usuarios/alumno/Escritorio/Curso-JavaScript/python-crud/backend/pruebas.db'

#----------------------------------------------
# Conectamos con la base de datos. 
# Retornamos el conector (conn)
#----------------------------------------------
def conectar():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


#----------------------------------------------
# Esta funcion crea la tabla "tareas" en la
# base de datos, en caso de que no exista.
#----------------------------------------------
def crear_tabla():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
                CREATE TABLE IF NOT EXISTS tareas(
                    tarea_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    descripcion TEXT(255) NOT NULL,
                    done BOOLEAN NOT NULL
                    )
            """)
    conn.commit()
    cursor.close()
    conn.close()

#----------------------------------------------
# Lista todas las tareas en la base de datos.
#----------------------------------------------
@app.route('/tareas', methods=['GET'])
def listar_tareas():
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tareas")
        tareas = cursor.fetchall()
        response = []
        for tarea in tareas:
            response.append({
                'codigo': tarea['tarea_id'],
                'descripcion': tarea['descripcion'],
                'done': tarea['done']
            })
        return jsonify(response)
    except:
        return jsonify({'error': 'Error al listar las tareas'}), 500
    
#----------------------------------------------
# Muestra en la pantalla los datos de una
# tarea a partir de su código.
#----------------------------------------------
@app.route('/tareas/<int:tarea_id>', methods=['GET'])
def consultar_tarea(tarea_id):
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""SELECT * FROM tareas 
                            WHERE tarea_id=?""", (tarea_id,))
        tarea = cursor.fetchone()
        if tarea is None:
            return jsonify({'error': 'Tarea no encontrado'}), 404
        else:
            return jsonify({
                'codigo': tarea['tarea_id'],
                'descripcion': tarea['descripcion'],
                'done': tarea['done']
            })
    except:
        return jsonify({'error': 'Error al consultar la tarea'}), 500

#----------------------------------------------
# Esta funcion da de alta una tarea en la
# base de datos.
#----------------------------------------------
@app.route('/tareas', methods=['POST'])
def alta_tarea():
    data = request.get_json()
    if 'descripcion' not in data or 'done' not in data:
        return jsonify({'error': 'Falta uno o más campos requeridos'}), 400
    try:
        print(f"descripcion {data['descripcion']} - done {data['done']}")
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""
                    INSERT INTO tareas(descripcion, done)
                    VALUES(?, ?) """,
                    (data['descripcion'], data['done']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'mensaje': 'Alta efectuada correctamente'}), 201
    except:
        return jsonify({'error': 'Error al dar de alta la tarea'}), 500

#----------------------------------------------
# Modifica los datos de una tarea a partir
# de su código.
#----------------------------------------------
# @app.route('/tareas/<int:tarea_id>', methods=['PUT'])
def modificar_tarea(tarea_id):
    data = request.get_json()
    if 'descripcion' not in data or 'done' not in data:
        return jsonify({'error': 'Falta uno o más campos requeridos'}), 400
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""SELECT * FROM tareas WHERE tarea_id=?""", (tarea_id,))
        tarea = cursor.fetchone()
        if tarea is None:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        else:
            cursor.execute("""UPDATE tareas SET descripcion=?, done=?
                                WHERE tarea_id=?""", (data['descripcion'], data['done'], tarea_id))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'mensaje': 'Tarea modificada correctamente'}), 200
    except:
        return jsonify({'error': 'Error al modificar la tarea'}), 500


# Version 2

@app.route('/tareas/<int:tarea_id>', methods=['PUT'])
def actualizar_tarea(tarea_id):
    try:
        conn = conectar()
        cursor = conn.cursor()
        # Obtener el valor actual de done
        cursor.execute("SELECT done FROM tareas WHERE tarea_id = ?", (tarea_id,))
        resultado = cursor.fetchone()
        if resultado is None:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        done_actual = resultado['done']
        # Calcular el nuevo valor inverso de done
        done_nuevo = 1 if done_actual == 0 else 0
        
        # Actualizar el valor de done en la base de datos
        cursor.execute("UPDATE tareas SET done = ? WHERE tarea_id = ?", (done_nuevo, tarea_id))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': 'Valor de done actualizado correctamente'})
    except Exception as e:
        return jsonify({'error': f'Error al actualizar la tarea: {str(e)}'}), 500


#----------------------------------------------
# Modifica los datos de una tarea a partir
# de su código.
#----------------------------------------------
@app.route('/tareas/<int:codigo>', methods=['POST'])
def eliminar_tarea(codigo):
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""DELETE FROM tareas WHERE tarea_id = ?""", (codigo,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
            'codigo': codigo,
            'descripcion': 'Tarea eliminada exitosamente.',
            'done': 0
        })
    except Exception as e:
        print(f"Error al consultar la tarea: {str(e)}")
        return jsonify({'error': 'Error al consultar la tarea'}), 500


def agregar_tarea(desc, done):
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("""
                        INSERT INTO tareas(descripcion, done)
                        VALUES(?, ?)""",
                        (desc, done)
                        )
        conn.commit()
        cursor.close()
        conn.close()
        print("Tarea agregada exitosamente.")
    except sqlite3.Error as e:
        print("Error al agregar la tarea:", e)

def eliminar_tarea(tarea_id):
    try:
        conn = conectar()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tareas WHERE tarea_id = ?", (tarea_id,))
        conn.commit()
        cursor.close()
        conn.close()
        print("Tarea eliminada de la base de datos")
    except sqlite3.Error as e:
        print("Error al eliminar tarea:", e)


#----------------------------------------------
# Ejecutamos la app
#----------------------------------------------
if __name__ == '__main__':
    crear_tabla()
    app.run()

