# System Name: Billbot

- David Salazar Rodriguez - 2019000145
- Gabriel Gutiérrez Mata  - 2022437833
- Fabricio Picado Alvarado - 2022104933
- Jefferson Salas Cordero - 2022437576

## Description

## Stack
    React Native

    Cognito - 2FA
    
    Node.js (NestJS) / Lambda en conjunto con API gateaway (por definir)
    
    PostgreSQL como base dedatros.
    
    API´s:
     Plaid / TrueLayer para conectar cuentas bancarias de manera segura. Stripe / PayPal API para gestionar pagos y suscripciones dentro de la app.
    
    AWS para manejar el hosting.

    Cognito para manejar el 2FA
    
    Sentry para monitoreo y detección de errores en tiempo real.

    Datadog para análisis y observabilidad del sistema.

    Testing:
        React Testing Library para pruebas unitarias e integración en frontend.

        Postman para validación de APIs.

    

## Frontend Design Specification


### Authentication Platform

a) login y password

b) login y password automatic screen generation or SDK for screen generation

c) compatible with your FE programming language

d) access by API available

e) MFA and a sandbox for testing purpose

- Using a demo code, proceed to test how the chosen platform works and how the login screen can be customized. Document this process in the MD file. The demo code must be use in the selected programming language of the FE.

- Using Postman, make API calls to simulate authentication with MFA. Document the process and save your own Postman collection for future review

- suggested platforms to look into: auth0, okta, cognito, MS entra, onelogin, firebase, veriam