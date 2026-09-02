# Sistema de Gestión de Reservas

Proyecto académico de frontend para gestionar reservas de espacios y servicios. La aplicación permite crear, listar, buscar, filtrar, editar y eliminar reservas, además de visualizar estadísticas por estado y categoría.

## Funcionalidades

- Crear nuevas reservas
- Editar reservas existentes
- Eliminar reservas
- Buscar por cliente o espacio
- Filtrar por categoría y estado
- Cambiar el estado de una reserva entre pendiente, confirmada y cancelada
- Ver estadísticas generales del sistema
- Persistencia de datos mediante localStorage

## Tecnologías usadas

- React
- Vite
- Bootstrap
- JavaScript

## Estructura del proyecto

```bash
reservas-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ReservationForm.jsx
│   │   ├── ReservationItem.jsx
│   │   ├── ReservationList.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filter.jsx
│   │   └── Statistics.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   └── utils/
│       └── reservationModel.js
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

## Cómo correr el proyecto

1. Instala las dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre la app en tu navegador en la URL que te indique Vite.

## Cómo compilar para producción

```bash
npm run build
```

## Persistencia de datos

La aplicación guarda la información de las reservas en localStorage para que no se pierda al recargar la página. Esto se realiza a través del hook personalizado `useLocalStorage`, que lee y guarda el estado principal de la app.

## Reglas de negocio

La validación incluye:

- campos obligatorios
- duración mínima de 1 hora
- fecha no anterior al día actual
- conflicto de horario para el mismo espacio y fecha
- cálculo de precio por categoría y duración

## Estado del proyecto

El proyecto está en una versión funcional con flujo completo de reservas y persistencia local, listo para seguir ampliando con backend, autenticación o mejoras visuales.

## Autor

Proyecto académico desarrollado como práctica de frontend con React.
