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
- `PagoRepository` use exclusively the payment API communication.
- `Notificador` use notification sends without affecting other functionalities.
- `HistorialManager`use transaction processing and maintains their history.

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
- `Notificacion` use exclusively the sending of notifications.
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
- `NotificacionObserver` use notification status updates.

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
- `SafeAreaView` to use safe areas on devices with notches or curved edges.
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

A **modular monolithic** architecture is adopted for the backend, using the **NestJS** framework on **Node.js**.

#### Internal layers handling requests/responses

A layered architecture is employed to ensure a clear separation of responsibilities:

- **Controller**: Handles HTTP requests/responses (e.g., PagoController, UsuarioController).

- **Service**: Contains business logic (e.g., PagoService, UsuarioService).

- **Repository**: Manages data access (e.g., PagoRepositoryImpl, UsuarioRepositoryImpl).

#### Interaction of design patterns with requests or other triggers

**Dependency Injection**

Used natively in NestJS to decouple classes from each other.

- Allows injecting repositories, domain services, and adapters without coupling implementations.
- Facilitates unit testing and architectural flexibility.

---

**Command Handler**

Clearly separates read and write operations.

- `CreatePagoCommandHandler`: Handles payment creation logic.
- `ActualizarEstadoCommandHandler`: Processes transaction state changes.

---

**Event Sourcing**

Used to record significant events in the financial system.

- Each relevant action generates an event (`PagoRealizadoEvent`, `CuentaBloqueadaEvent`) that can be replayed to reconstruct the system's state.

**Decorator**

Extensively used for validation, authorization, and data transformation.

- Decorators like `@UseGuards`, `@Roles`, `@Transform`, and custom validators apply cross-cutting rules to the system.

**Adapter**

Part of the hexagonal architecture to isolate external dependencies.

- Examples: `StripeAdapter`, `PlaidAdapter`.
- Enables integration with third-party services without coupling to the domain core.

**Template Method**

Applied in abstract services that define reusable common flows.

- `BaseServicioPago`: Defines generic steps for payment processing.
- Subclasses complete specific logic for banks, cards, etc.

---

### 2. Serverless, Cloud, On-Premise, or Hybrid?

A **Serverless cloud solution (AWS)** is adopted for its automatic scalability, cost efficiency, and ease of integration.

#### Hardware and cloud machine types

These are the technologies and services we will use:

**AWS Lambda**
- Executes serverless functions without the need to manage servers.
- Classes like `PaymentService` create on-demand payments, and `TransactionHandler` efficiently processes transactions.

**RDS PostgreSQL**
- Stores transactional data, ensuring consistency.
- `PaymentRepository` stores payment details, and `UserRepository` stores user data.

**AWS API Gateway**
- Manages scalable API request traffic.
- Classes like `PaymentController` handle payment requests, and `UserController` manages user requests.

**AWS Cognito**
- Manages user authentication and authorization.
- `AuthService` handles user authentication, and `SessionManager` validates user sessions.

**Amazon SNS**
- Sends notifications at scale.
- Classes like `NotificationService` send notifications about payment or account status, and `PaymentProcessor` sends notifications after processing a payment.

**CloudWatch**
- Provides real-time monitoring and tracking.
- `ErrorLogger` logs errors and exceptions, and `TransactionTracker` tracks transactions to improve performance.

#### Impact on frameworks, libraries, and languages

These are the frameworks, libraries, and languages we will use:

| Technology   | Role                | Main Advantage                                    |
|--------------|---------------------|--------------------------------------------------|
| Node.js      | Backend runtime     | Non-blocking I/O, high performance in the cloud  |
| NestJS       | Backend framework   | Modular, supports MVC, scalable                 |
| TypeScript   | Base language       | Strong typing, maintainability, and scalability |
| PostgreSQL   | Database            | ACID integrity, complex queries                 |
| Stripe/Plaid | External gateways   | Reliable, secure, widely adopted                |

---

### 3. Service vs. Microservices?

A **service-based architecture** is used to facilitate responsibility separation and enable progressive scalability.

#### Logical divisions to distribute workload

| Service              | Main Responsibility                          |
|----------------------|----------------------------------------------|
| AuthService          | Authentication and authorization management |
| PaymentService       | Payment processing                          |
| SubscriptionService  | Subscription plan management                |
| NotificationService  | Notification delivery                       |
| UserService          | User registration and profile management    |

#### Impact on code organization and team collaboration

- **Branching Policy**:

The **GitFlow** strategy is used for branch management.

- **main**: Main branch containing the stable version of the code.
- **develop**: Development branch containing new features and fixes before merging into `main`.
- **Feature branches**: Each new feature is developed in a separate branch from `develop` and merged back once completed.
- **Release branches**: Created for preparing new versions, merged into `main` and `develop` afterward.
- **Hotfix branches**: Created for critical production fixes, merged into `main` and `develop`.

- **Versioning and Release Management**:

The **SemVer** (Semantic Versioning) convention is followed: `MAJOR.MINOR.PATCH`.

- For each stable release, the **`PATCH`** number is incremented for minor fixes, **`MINOR`** for new features without breaking compatibility, and **`MAJOR`** for disruptive changes that break compatibility.
- A system of **weekly releases** with incremental versions is implemented.
- Each team is exclusively responsible for its respective service (e.g., `PaymentService`, `UserService`).

- **Collaboration and Branch Usage**:

- Teams collaborate using **pull requests** to integrate changes into `develop` or `release` branches.
- Code reviews are mandatory before merging any branch into `main` or `develop`.
- **Change documentation** is encouraged in each pull request to facilitate understanding of modifications.
- Teams must follow a **CI/CD** process that automates testing and deployments to staging or production environments.

- **Team Scalability**:

- Dividing responsibilities by service facilitates team growth, as each team specializes in a specific service.
- As the system scales, teams can migrate from a monolithic structure to **microservices** if necessary, without disrupting workflows.

---

### 4. Event-Driven, Queues, Brokers, Producer/Consumer, Pub/Sub?

#### Parts requiring these architectures

- Payment confirmation  
- Automatic billing reminders  
- Event logging for traceability  

#### Cloud services providing these features

| Event               | AWS Service            | Architecture Pattern |
|---------------------|------------------------|----------------------|
| Payment completed   | EventBridge + Lambda   | Pub/Sub              |
| Pending reminder    | EventBridge + Lambda   | Pub/Sub              |
| Subscription error  | EventBridge + Lambda   | Pub/Sub              |

#### Integration layers and classes used

- `PagoService`: Emits events  
- `NotificadorService`: Event subscriber  
- `EventoService`: Flow orchestrator  
- `LoggerService`: Event and error persistence  

---

### 5. API Gateway (Security & Scalability)

#### Is an API Gateway necessary?

Yes. **AWS API Gateway** is used to manage traffic to the serverless backend.

#### Selected cloud service

- **AWS API Gateway**: Natively integrates with AWS Lambda and Cognito.

#### How does it support security and scalability?

##### Security

- Authentication with JWT via AWS Cognito.  
- CORS validation.  
- Throttling and quotas per user or IP.  
- Integration with AWS WAF for custom rules.

##### Scalability

- Automatically scales horizontally.  
- Handles hundreds or thousands of concurrent requests without manual intervention.  
- Provides caching, logging, and metrics for continuous optimization.


### Data Layer Design

## Architecture Design

## Architecture Compliance Matrix


