# System Name: Billbot

- David Salazar Rodriguez - 2019000145
- Gabriel Gutiérrez Mata  - 2022437833
- Fabricio Picado Alvarado - 2022104933
- Jefferson Salas Cordero - 2022437576

## Description

Billbot is an AI voice-activated payment assistant that allows users to schedule and execute recurring payments seamlessly. By integrating banking APIs and payment processors, Billbot automates transactions and provides a user-friendly experience for managing financial commitments.

## Stack
    React Native

    Cognito - 2FA
    
    Node.js (NestJS) / Lambda in conjunction API gateaway
    
    PostgreSQL as the database.
    
    API´s:
     Plaid / TrueLayer to securely connect the bank accounts.
     Stripe / PayPal API to manage payments and subscriptions within the app.
    
    AWS for hosting management.

    Cognito to handle 2FA
    
    AWS CloudWatch for error logs, and infrastructure monitoring and metrics

    AWS X-Ray for errors and tracking services and latency

    Testing:
        React Testing Library for unit tests and frontend integration.

        Postman for API's validation


## Client Architecture

The system will follow a N-Layer architecture, because it follows a separation of tasks, where the frontend (React Native) will communicate with the backend (Node.js/NestJS).

    a) Mobile Developement = Native 
    Even though the application uses JavaScript, it generates native code for Android and IOS.

    b) Side Rendering = client-side rendering 
    Because the aplication is dynamic and interactive, and it involves the browser receiving a minimal HTML file and using JavaScript to render content dynamically.


## Frontend Design Specification


### Authentication Platform //In-Progress

a) login y password

b) login y password automatic screen generation or SDK for screen generation

c) compatible with your FE programming language

d) access by API available

e) MFA and a sandbox for testing purpose

- Using a demo code, proceed to test how the chosen platform works and how the login screen can be customized. Document this process in the MD file. The demo code must be use in the selected programming language of the FE.

- Using Postman, make API calls to simulate authentication with MFA. Document the process and save your own Postman collection for future review

- suggested platforms to look into: auth0, okta, cognito, MS entra, onelogin, firebase, veriam

## Visual Components

*Patterns & Principles:*

## Patterns & Principles

These principles ensure that the UI is scalable, maintainable, and easy to extend.
### 1. Principios SOLID

#### 1.1. Single 
Each class has a single responsibility
- `PagoRepository` handles exclusively the payment API communication.
- `Notificador` handles notification sends without affecting other functionalities.
- `HistorialManager`handles transaction processing and maintains their history.

#### 1.2. Open
Classes are open for extension but closed for modification:
- `ProcesadorPagoStrategy` allows adding new payment processors without altering the core logic.
- `NotificadorFactory` can be expanded to include new notification types.
- `PagoRepositoryImpl` allows method extension without modifying the base structure.

#### 1.3. Liskov 
The derived classes can substitute the base ones without altering the behavior:
- `NotificadorEmail`, `NotificadorSMS` and `NotificadorPush` implement the `Notificador` interface while maintaining its base contract.
- `ProcesadorBancario` and `ProcesadorTarjeta` extend  `ProcesadorPagoStrategy`, allowing the payment method to be changed without modifying the core functionality.

#### 1.4. Interface
Interfaces are small and focused:
- `ProcesadorPagoStrategy` defines specific methods for payment processors.
- `Notificacion` handles exclusively the sending of notifications.
- `PagoObserver` defines change notifications for `PagoRecurrente`.

#### 1.5. Dependency
Modules depend on abstractions, not concrete implementations:
- `ContextoPago` depends on `ProcesadorPagoStrategy`, allowing the implementation to be changed without modifying the controller.
- `AuthService` provides authentication and user validation through a single entry point.

### 2. Principio DRY
Eliminates duplication through reuse:
- `PagoRepositoryImpl` centralizes data access logic to avoid repetition across different services.
- `HistorialManager` encapsulates transaction history management, preventing logic duplication in multiple places.

### 3. Separation of Concerns
Responsibilities are divided into distinct layers:
- **Models** like `PagoRecurrente`, `Usuario`and `Transaccion` handle data structures
- **Repositories** like `PagoRepository` manage data access.
- **Services** like `PagoService`and `UsuarioService` contain business logic.
- **Controllers** like `PagoController` handle UI communication
- **Observers** like `PagoObserver` and `NotificacionObserver` enable system event response

### 4. Patrones de Diseño

#### 4.1. MVVM (Model-View-ViewModel)
- **Model:** Data structures like `Usuario`, `CuentaBancaria` and `Transaccion` with defined types.
- **View:** Visual components such as `PaymentScreen`and `UserProfileScreen`.
- **ViewModel:** Presentation logic classes like  `PaymentViewModel`, integrated with React Native hooks including `useState` and `useEffect`.

#### 4.2. Repository
- `PagoRepositoryImpl` manages payment persistence and encapsulates database access.
- `PageRepositoryImpl` extends  `PageRepository`, to ensure flexible handling of recurring payments

#### 4.3. Factory
- `NotificadorFactory` creates `Notificador` instances based on notification type (SMS, Email, Push)

#### 4.4. Strategy
- `ProcesadorPagoStrategy` enables swapping payment methods without modifying core logic.
- `ProcesadorBancario` and `ProcesadorTarjeta`  implement specific payment strategies.

#### 4.5. Observer
- `PagoObserver` enables subscription-based notifications for users.
- `NotificacionObserver` handles notification status updates.

#### 4.6. Singleton
- `AuthService` ensures only one authentication instance exists application-wide.

## Toolkits & Estándares
We adopt tools that facilitate the implementation and maintenance of visual components, ensuring consistency across both iOS and Android platforms.
### 1. React Native
- `Cross-platform` mobile development framework for iOS/Android.
- Optimized native components including `FlatList`, `Button`, and `View`.
- Built-in support for native modules.
### 2.React Navigation
- Navigation management with `StackNavigator`, `DrawerNavigator`, and `BottomTabNavigator`, enabling smooth transitions between screens.
- Passing parameters between screens using `route.params`, simplifying data transfer between views.

### 3. Componentes UI
- `SafeAreaView` to handle safe areas on devices with notches or curved edges.
- `Vector-icons` for consistent iconography across platforms.
- `Gesture-handler` to efficiently manage touch interactions.

### 4. Platform Standards
- Use of `cross-platform` design principles.
- Visual components like buttons, lists, and text fields follow guidelines that ensure a coherent interface without requiring adjustments between platforms.

### 5. Complementary Modules
- `react-native-safe-area-context` for safe area management.
- `expo-font` for loading custom fonts.
- `expo-asset` for optimized handling of images and resources.
- `@expo/vector-icons` for a cross-platform icon library.

## Object design patterns

![Descripción de la imagen](ObjectDisignPatterns.png)

## External services

## A. UI ↔ Business Logic (Frontend)
**Interaction between UI and client-side logic.**

| Component            | Tech + Pattern          | Description                                                          | Relationships                                                         |
| -------------------- | ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **PaymentViewModel** | MVVM (React Hooks)      | Payment logic, validates inputs and communicates with PagoRepository | `PaymentScreen UI` ↔ `PagoRepository` ↔ `Stripe/APIs`                 |
| **AuthService**      | Singleton + Cognito SDK | Manages user authentication (login, and 2FA)                         | `LoginScreen UI` ↔ `AWS Cognito` ↔ `NestJS BE`                        |
| **Notificador**      | Observer                | Listens to payment events and triggers SMS/notifications             | `PagoRepository` ↔ `AWS SNS (NestJS)`                                 |
| **PagoRepository**   | -                       | API calls for payments and bank operations                           | `PaymentViewModel` ↔ `NestJS backend` ↔ `Stripe/Plaid/TrueLayer APIs` |

## B. External Services Integrations

### 1. Authentication and Authorization
| Service     | Technology  | Description                         | Relationships                               |
| ----------- | ----------- | ----------------------------------- | ------------------------------------------- |
| **Cognito** | Cognito SDK | Handles user authentication and 2FA | `AuthService (frontend)` ↔ `NestJS backend` |

### 2. SaaS and Payment Platforms
| Service             | Technology | Description                            | Relationships                            |
| ------------------- | ---------- | -------------------------------------- | ---------------------------------------- |
| **Stripe/PayPal**   | Stripe SDK | Payments processes and subscriptions   | `ProcesadorPagoStrategy (BE)` ↔ `NestJS` |
| **Plaid/TrueLayer** | Plaid SDK  | Links bank accounts and retrieves data | `PagoRepository` ↔ `NestJS BE`           |

### 3. External APIs
| Service     | Technology | Description             | Relationships                    |
| ----------- | ---------- | ----------------------- | -------------------------------- |
| **AWS SNS** | SNS API    | Sends reminders via SMS | `Notificador (FE)` ↔ `NestJS BE` |

### 4. Monitoring
| Service            | Technology | Description               | Relationships             |
| ------------------ | ---------- | ------------------------- | ------------------------- |
| **AWS CloudWatch** | CloudWatch | Metrics and Log errors    | `NestJS/Lambda (BE only)` |
| **AWS X-Ray**      | X-ray      | Traces API errors/latency | `API Gateway` ↔ `Lambda`  |

## Project structure


//Se toma del AWS-DEMO

## Final FE architecture diagram

// En creacion

# Backend Design Specifications

## Backend Design Specifications

### Proof of Concepts

## POC

POC Step 1: Handler Responsibilities (SOLID & Cohesion Principle)

    Challenge:
    Handlers in the original template mixed the business logic and data, and accesing repositories directly, that led leading to low cohesion and hard-to-maintain code

    Solution:

        Split responsibilities into two distinct handlers:

            getUserBalanceHandler for checking balance and initiating payment

            paymentHandler for processing card payments

        Introduced a service layer (UserService, PaymentService, logger) that encapsulates business logic and interacts with repositories

    Advantages over Original Template:

        Clearer responsibilities: Each handler now has a single task, better defined

        Decoupling: Handlers no longer access repositories directly, making testing and other aspects like scalability easier

        Maintainability: Future changes in business logic or data sources only affect the service layer, not the handlers

POC Step 2: README.md Fixes & Adjustments

    Challenge:
    Original README lacked documentation of deployment issues and fixes, causing confusion around Serverless configuration and AWS permissions

    Solution Chosen:

        Updated the README to include:

            A list of encountered errors (reserved environment variables, IAM permission issues)

            Step by step fixes applied (e.g., removing AWS keys from .env, adding serverless-plugin-typescript, adjusting provider.environment)

            Clearer and better instructions

    Advantages over Original Template:

        Reproducibility: easier to clone and run

        Transparency: Common errors are documented.

        Onboarding speed: Reduced time to first success for team members

POC Step 3: Logger Improvements (Design Pattern Required)

    Challenge:
    The template used only console.log, which was unsuitable for production serverless apps (no persistence, no configurable destinations, etc)

    Solution Chosen:

        Defined a Logger interface and two implementations:

            ConsoleLogger (for local developement)

            CloudWatchLogger (writes to AWS CloudWatch)

        Applied the Strategy Pattern so the logger can be swapped based on NODE_ENV.

    Advantages over Original Template:

        Environment specific logging: Development logs can stay local, and production logs persist in CloudWatch

        Extensibility: new logger implementations can be added without changing handlers

        Better observability: new logs improve monitoring and debugging

POC Step 4: Optional & Mandatory Middleware (Design Pattern Required)

    Challenge:
    The original template didnt have a structured middleware system. All middleware were optional or hardwired, and authentication wasnt guaranteed, so create a new structure and replace the old one was tricky

    Solution Chosen:

        Created witMiddleware functions using the Chain of Responsibility Pattern.

        Allowed separation of mandatory middlewares (authMiddleware) from optional ones (loggerMiddleware)

        Each middlewares execute() either throws an error or passes control to the next.

    Advantages over Original Template:

        Flexible chaining: Easily manipulate middlewares (add, modify and delete).

        Enforced authentication: non optional middleware always runs first, to avoid unauthorized access

        Modularity: Each middleware focuses on a single task (auth, validation, logging)

POC Step 5: Repository Layer Improvements (Decoupling & Reusability)

    Challenge:
    Handlers accessed repositories directly, mixing data with business. No multiple data sources or swapping of repositories

    Solution Chosen:

        Introduced a service layer (UserService, PaymentService, logger) between handlers and repositories

        Repositories remain simple data access classes, while services handle business rules

    Advantages over Original Template:

        Decoupling: Business logic and data are now separated

        Reusability: Services can be reused in othe contexts

        Testability: repositories con mock in tests without touching handlers

POC Step 6: Deployment & Testing

    Challenge:
    The original template had no automated tests or DB cloud integration.

    Solution Chosen:

        Implemented two unit test functions (with Jest), to simulate APIGatewayProxyEvent and its context

        services were configurated to read from simulated cloud database (repos in memory).

        a Postman collection with two requests for the live endpoints (/example-one, /example-two), including headers and bodies

    Advantages over Original Template:

        testing: handler logic remains correct during changes

        Cloud integration: Services already structured to connect to real cloud databases

        Easy testing: Postman collection lets developers quickly validate the deployed API

### Backend Architecture

//////////////////////////////

Se adopta una arquitectura **Monolithic-MVC** expuesta mediante **REST API**, utilizando el framework **NestJS** sobre **Node.js**.

#### Capas internas que manejan requests/responses

La comunicación sigue el patrón típico **MVC**:

- **Controller**: Utilizadas por clases como `PagoController`,`UsuarioController`, `AuthController`. Estas reciben las peticiones HTTP, validan parámetros iniciales y delegan en los servicios. 
Permiten aislar la lógica de entrada/salida del core de negocio. Responden a los endpoints definidos en la API. 


- **Service**: Clases como `PagoService`, `UsuarioService`, `AuthService`, ejecutan la lógica de negocio, validan flujos y orquestan los repositorios.
Estas centralizan la lógica del sistema para mantener el código desacoplado y reutilizable.


- **Repository**: Las clases de `PagoRepositoryImpl`, `UsuarioRepositoryImpl`, `CuentaRepositoryImpl` interactúan con la base de datos y con APIs externas.
Aislando el acceso a datos. Facilitan pruebas y cambios en infraestructura sin afectar la lógica.


#### Interacción de patrones de diseño con requests u otros triggers

- **Factory**: La clase de `NotificadorFactory` utiliza el patron para el Service que maneja las notificaciones.
Motivo del uso, crear instancias de `NotificadorEmail`, `NotificadorSMS` o `NotificadorPush` dinámicamente según configuración sin acoplar el servicio principal.

- **Strategy**: Las clase de `ProcesadorPagoStrategy`, `ProcesadorBancario`, `ProcesadorTarjeta` son utilizadas en `PagoService` para manejar múltiples métodos de pago.
Permitiendo que el servicio conmute entre distintas pasarelas de pago sin modificar su lógica.


- **Observer**: `PagoObserver`, `NotificacionObserver` son utilizadas por `PagoService` y `Notificador` reaccionado a eventos como pagos exitosos y disparar notificaciones sin acoplar servicios directamente.

- **Singleton**: `AuthService` utilizada en todo el sistema, garantiza una única instancia para autenticación y validación Cognito.

---
### 2. Serverless, Cloud, On-Premise, or Hybrid?

Se adopta una solución **Serverless en la nube (AWS)** por sus capacidades de escalabilidad automática, eficiencia de costos y facilidad de integración.

#### Hardware y tipos de máquinas cloud

| Componente       | Tipo / Servicio AWS        | Propósito                                |
|------------------|----------------------------|------------------------------------------|
| Lógica de backend| AWS Lambda   | Funciones serverless                     |
| Base de datos    | RDS PostgreSQL | Datos relacionales ACID               |
| Gateway API      | AWS API Gateway            | Entrada segura y escalable               |
| Autenticación    | AWS Cognito                | Gestión de usuarios y sesiones           |
| Notificaciones   | Amazon SNS                 | Envío de SMS/Email por eventos           |
| Logs/Monitoreo   | CloudWatch + X-Ray         | Logging, trazabilidad y métricas         |

#### Impacto en frameworks, librerías y lenguajes

| Tecnología   | Rol                | Ventaja principal                                   |
|--------------|--------------------|-----------------------------------------------------|
| Node.js      | Runtime backend    | I/O no bloqueante, alto rendimiento en cloud        |
| NestJS       | Framework backend  | Modular, soporta MVC, escalable                     |
| TypeScript   | Lenguaje base      | Tipado fuerte, mantenimiento y escalabilidad        |
| PostgreSQL   | Base de datos      | Integridad ACID, consultas complejas                |
| Stripe/Plaid | Pasarelas externas | Confiables, seguras, ampliamente adoptadas          |

---

### 3. Service vs. Microservices?

Se implementa una arquitectura **modular monolítica**, con separación clara por dominios funcionales.

#### Divisiones lógicas para distribuir la carga de trabajo

| Módulo             | Responsabilidad principal                    |
|--------------------|-----------------------------------------------|
| AuthModule         | Autenticación y autorización                  |
| PagoModule         | Procesamiento de pagos                        |
| SuscripcionModule  | Gestión de planes de suscripción              |
| NotificacionModule | Envío de notificaciones                       |
| UsuarioModule      | Registro y perfil de usuarios                 |

#### Impacto en organización del código y colaboración del equipo

- Cada módulo tiene su propio controlador, servicio y repositorio.
- Se favorece la independencia de desarrollo, pruebas y despliegue.
- Permite escalar el equipo asignando ownership por módulo.
- Posible migración futura a microservicios si el sistema crece.

---

### 4. Event-Driven, Queues, Brokers, Producer/Consumer, Pub/Sub?

#### Partes que requieren estas arquitecturas

- Confirmación de pagos  
- Envío automático de recordatorios de cobro  
- Registro de eventos para trazabilidad

#### Servicios cloud que proporcionan estas características

| Evento              | Servicio AWS          | Patrón de arquitectura |
|---------------------|-----------------------|-------------------------|
| Pago realizado      | SNS + Lambda          | Pub/Sub                 |
| Recordatorio pendiente | EventBridge + Lambda | Event-Driven            |
| Error en suscripción| CloudWatch + Logs     | Logging + Alerta        |

#### Capas de integración y clases utilizadas

- `PagoService`: Emite eventos  
- `NotificadorService`: Suscriptor de eventos  
- `EventoService`: Orquestador de flujos  
- `LoggerService`: Persistencia de eventos y errores  

---

### 5. API Gateway (Security & Scalability)

#### ¿Es necesario un API Gateway?

Sí. Se utiliza **AWS API Gateway** para gestionar el tráfico hacia el backend serverless.

#### Servicio cloud seleccionado

- **AWS API Gateway**: Se integra nativamente con AWS Lambda y Cognito.

#### ¿Cómo apoya la seguridad y escalabilidad?

##### Seguridad

- Autenticación con JWT vía AWS Cognito.  
- Validación de CORS.  
- Throttling y cuotas por usuario o IP.  
- Integración con AWS WAF para reglas personalizadas.

##### Escalabilidad

- Escala horizontalmente de forma automática.  
- Maneja cientos o miles de requests concurrentes sin intervención manual.  
- Provee caching, logging y métricas para optimización continua.

///////////////////////////////

### Data Layer Design

### 1. data layer design

#### a) Data topology
        
**Cloud service technology:** 

OLTP (with AWS PostgreSQL)

**Object-oriented design patterns:**  Patterns such as Repository, to encapsulate the data base access.

**Class layers for data access:** Repositories to handle data operations (PagoRepositoryImpl, UsuarioRepositoryImpl, CuentaRepositoryImpl)

**Configuration policies/rules:** automatic backups, AWS RDS replication, automatic failover

**Expected benefits:** good scalability, cost reduction, high availability, efficiency in developement

#### b) Big Data Repository

**Cloud service technology:**  AWS S3 as Data Lake

**Object‑oriented design patterns:** Adapter/Facade: wrap AWS SDK calls for S3. Singleton: ensure a single shared client instance for each AWS service

**Class layers for data access:** Repository layer (generic DataLakeRepository interface) that provides an implementation that uses the Adapter/Facade to read/write files in S3

**Configuration policies/rules:** S3 rules: transition infrequently accessed data

**Expected benefits:** Scalability: virtually unlimited storage in S3
Cost efficiency: low‑cost object storage with tiered archiving

#### c) Relational Database

The reason to use the relational data base is explained in point a, but the reasons are that it allows complex requests, the well structured data model, good consistency, and also that it is very secure.

#### d) Data Access Permissions

**Cloud service technology:**AWS Cognito for user authentication and identity pools, with postgreSQL (RLS) for other boundaries.

**Object‑oriented design patterns:** Singleton (AuthService) for single entry point for validating

**Class layers for data access:** Repositories like PagoRepositoryImpl, assume that those filters have already been applied.

**Configuration policies/rules:** encryption for RDS, also enable CloudWatch Logs + RDS audit logs for all data‑access events

**Expected benefits:** manteinability, multiple layers of verification, isolation.

#### e) fail tolerance and recover model and politics

**Cloud service technology:** AWS CloudWatch for alarms, metrics and logs, AWS X-Ray for fail tracing, AWS fast failover for PostgreSQL

**Object‑oriented design patterns:** Observer to notify an alarm service, and Singleton to ensure a unic instance of failover manager.

**Class layers for data access:** Alerting service using CloudWatch and AWS X-Ray to send notifications, failover manager that promotes the RDS replicate. 

**Configuration policies/rules:** Backups (continuos backups every determined time), CLoudWatch alarms.

**Expected benefits:** High availability, fast recovery, visibility and monitoring

### 2. object oriented design - programming 

#### a) Transactional via SQL Statements 

**Cloud service technology:** AWS RDS PostgreSQL

**Object‑oriented design patterns:** RepositoryImpl repositories expose CRUDs and other queries.  

**Class layers for data access:** Repositories like PagoRepositoryImpl, UsuarioRepositoryImpl, CuentaRepositoryImpl, expose different methods like commits or rollbacks. multiple repositories can be accesed in a single transaction context.

**Configuration policies/rules:** Timeouts (auto rollbacks), Isolation, retry policies (after a series of failures) 

**Expected benefits:** Testability and manteinability, portability, faster developemenet

#### b) use of ORM

**Cloud service technology:** AWS RDS PostgreSQL

**Object‑oriented design patterns:** entities map to tables and PagoRepositoryImpl, UsuarioRepositoryImpl, CuentaRepositoryImpl extend TypeORMs  

**Class layers for data access:** Services call repository methods when needed, also define different entities with decorators.

**Configuration policies/rules:** validation (use class validators entities, to ensure the data), 

**Expected benefits:** Productivity, manteinability (centralized entity definitions simplify evolutions of the data model), consistency (uniform data access patterns across modules and services).

#### c) Layers for connection control, concurrency, data mapping, and object/data models

**Cloud service technology:** built-in connection pool in AWS PostgreSQL

**Object‑oriented design patterns:** Singletion (a single shared pool of db connections), data mapper to map between entity and object model, factory model to create and configure connections from the pool.

**Class layers for data access:** connection layer, mapping layer, repository layer, data object layer, domain model layer.

**Configuration policies/rules:** Transaction isolation, mapping conventions, connection pool (set a max or idle time).

**Expected benefits:** safe concurrency, separate concerns, manteinability, better performance.

#### c2) pool use for connections

**Cloud service technology:** AWS RDS PostgreSQL (with support for pooling connections, like RDS Proxy)

**Object‑oriented design patterns:** Singletion (shared ConnectionPoolManager that ensures only one instance manages pool), Factory (ConnectionFactory  encapsulates creation of DB connection), optional use of RDS Proxy as an external manager.

**Class layers for data access:** connection layer (initializes and manages, and provides connections), repository and service layer

**Configuration policies/rules:** define a max size pool, connection timeout, validate connections, enable logs/metrics for monitoring

**Expected benefits:** reduce of overhead, better scalability, centralized connection config to reduce errors or duplications.

#### d) use of cache

**Cloud service technology:** Redis (to quickly access most frequented data)

**Object‑oriented design patterns:** check redis first, if not found the check data base, singleton (to ensure a single shared Redis cache).

**Class layers for data access:** cache layer (RedisCacheManager, centralized cache), repository layer (PagoRepositoryImpl, UsuarioRepositoryImpl, and CuentaRepositoryImpl first check Redis > RedisCacheManager before the database)

**Configuration policies/rules:** monitoring (check performance, memory usage, etc), persistance (use redis only if needed), use structured names for better and easier validations.

**Expected benefits:** performance mainly, improved UX, cost efficiency.

#### e) Native vs Interpreted Drivers

**Cloud service technology:** AWS RDS (PostgreSQL) accessed via native drivers for performance and reliability.

**Object‑oriented design patterns:** Strategy Pattern: used to define multiple query execution strategies

**Class layers for data access:** Data lccess layer (for handling connections and query execution), RepositoryImpl classes rely on it

**Configuration policies/rules:** native drivers for performance-critical operations and stored procedures, logging and monitoring enabled for both methods to track performance.

**Expected benefits:** flexibility (allows using the best tool for each use case), efficiency

#### f) data design

**Cloud service technology:** AWS RDS with PostgreSQL as the primary relational database engine

**Object‑oriented design patterns:** Repository pattern encapsulates query logic for each entity class,  

**Class layers for data access:** repository layer, Data transfer layer, entity model.

**Configuration policies/rules:** Normalization, naming conventions.

**Expected benefits:** Clariry, reusability, manteinability, data integrity and scalability.

## Architecture Design

## Architecture Compliance Matrix


