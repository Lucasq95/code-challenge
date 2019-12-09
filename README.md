# Code-challenge: Inscripción a materias

## Instalación

1. Hacer git clone del proyecto.
2. npm install
3. Si se encuentra en linux puede correr el script ./run.sh que va a levantar un docker con el api.

## Tests

Correr el script test.sh

## API

### Carreras

#### Obtener carreras disponibles:

    GET http://127.0.0.1:3000/careers

#### Crear nueva carrera:

    POST http://127.0.0.1:3000/careers

    body: {
      name: "",
      degree: ""
    }

#### Subscribir estudiante a una carrera:

    POST http://127.0.0.1:3000/careers/subscribed

    body: {
      student: "studentId",
      career: "careerId"
    }

### Estudiantes

#### Obtener listado de estudiantes:

    GET http://127.0.0.1:3000/students

#### Registrar nuevo estudiante:

    POST http://127.0.0.1:3000/students

    body: {
      fullname: "",
      address: "",
      birthDate: date()
    }

### Materias

#### Obtener listado de materias:

    GET http://127.0.0.1:3000/subjects

#### Crear una nueva materia:

    POST http://127.0.0.1:3000/subjects

    body: {
      name: "",
      weeklyHours: 8
    }

#### Agregar materia a una o más carrera:

    POST http://127.0.0.1:3000/subjects/addToCareers

    body: {
      subject: "subjectId",
      careers: ["careerId"]
    }

#### Subscribir estudiante a una materia:

    POST http://127.0.0.1:3000/subjects/subscribeStudent

    body: {
      subject: "subjectId",
      student: "studentId"
    }

#### Finalizar cursada de una materia:

    POST http://127.0.0.1:3000/subjects/closeSubject

    body: {
      studentSubject: "studentSubjectId",
      grade: 6
    }
