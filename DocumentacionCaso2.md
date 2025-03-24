# System Name: Billbot

- David Salazar Rodriguez - 2019000145
- Gabriel Gutiérrez Mata  - 2022437833
- Fabricio Picado Alvarado - 2022104933
- Jefferson Salas Cordero - 2022437576

## Description

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


### Authentication Platform

a) login y password

b) login y password automatic screen generation or SDK for screen generation

c) compatible with your FE programming language

d) access by API available

e) MFA and a sandbox for testing purpose

- Using a demo code, proceed to test how the chosen platform works and how the login screen can be customized. Document this process in the MD file. The demo code must be use in the selected programming language of the FE.

- Using Postman, make API calls to simulate authentication with MFA. Document the process and save your own Postman collection for future review

- suggested platforms to look into: auth0, okta, cognito, MS entra, onelogin, firebase, veriam