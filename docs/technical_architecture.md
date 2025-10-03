# Bitstra - Technical Architecture

## System Architecture Overview

This document outlines the technical architecture of Bitstra, a Bitcoin Lightning Network payment application that enables users to pay for airtime, data plans, and utility bills in Nigeria.

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend]
        Router[React Router]
        State[TanStack Query]
        Forms[React Hook Form + Zod]
    end

    subgraph "Application Layer"
        Pages[Pages Components]
        Components[UI Components]
        Hooks[Custom Hooks]
        Utils[Utility Functions]
    end

    subgraph "API Integration Layer"
        BitnobSDK[Bitnob SDK Client]
        QRMock[QR Code Mock Service]
        ErrorHandler[Error Handler]
    end

    subgraph "External Services"
        BitnobAPI[Bitnob Lightning API]
        BitnobSandbox[Bitnob Sandbox]
        BitnobProd[Bitnob Production]
    end

    subgraph "Infrastructure"
        Vite[Vite Build Tool]
        TailwindCSS[TailwindCSS]
        ShadcnUI[Shadcn/UI Components]
    end

    UI --> Router
    UI --> State
    UI --> Forms
    Router --> Pages
    Pages --> Components
    Components --> Hooks
    Components --> Utils
    Pages --> BitnobSDK
    BitnobSDK --> ErrorHandler
    BitnobSDK --> QRMock
    BitnobSDK --> BitnobAPI
    BitnobAPI --> BitnobSandbox
    BitnobAPI --> BitnobProd
    Components --> ShadcnUI
    UI --> TailwindCSS
    State --> BitnobSDK
```

## Application Flow Architecture

```mermaid
flowchart TD
    Start([User Visits App]) --> Home[Home Page]
    Home --> ServiceSelect{Select Service}

    ServiceSelect -->|Airtime| AirtimePage[Airtime Page]
    ServiceSelect -->|Data| DataPage[Data Page]
    ServiceSelect -->|Utility Bills| UtilityPage[Utility Bills Page]

    AirtimePage --> AirtimeForm[Airtime Form]
    DataPage --> DataForm[Data Form]
    UtilityPage --> UtilityForm[Utility Form]

    AirtimeForm --> FormValidation{Form Validation}
    DataForm --> FormValidation
    UtilityForm --> FormValidation

    FormValidation -->|Invalid| ErrorDisplay[Display Validation Errors]
    FormValidation -->|Valid| ConfirmPage[Confirmation Page]

    ConfirmPage --> QRGeneration[Generate QR Code]
    QRGeneration --> MockQR[Mock QR Code Display]
    MockQR --> PaymentFlow[Payment Flow]

    PaymentFlow --> TransactionStatus[Transaction Status]
    TransactionStatus --> Success[Success Page]
    TransactionStatus --> Failed[Failed Page]

    ErrorDisplay --> AirtimeForm
    ErrorDisplay --> DataForm
    ErrorDisplay --> UtilityForm

    Failed --> Retry{Retry Payment?}
    Retry -->|Yes| ConfirmPage
    Retry -->|No| Home

    Success --> Home
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant BitnobSDK
    participant BitnobAPI
    participant LightningNetwork
    participant ServiceProvider

    User->>Frontend: Select service (Airtime/Data/Utility)
    Frontend->>User: Display service form

    User->>Frontend: Fill form and submit
    Frontend->>Frontend: Validate form data

    alt Form is valid
        Frontend->>BitnobSDK: Create payment request
        BitnobSDK->>BitnobAPI: POST /bills/{service}

        alt Sandbox Mode
            BitnobAPI-->>BitnobSDK: Mock response
            BitnobSDK-->>Frontend: Mock QR code data
        else Production Mode
            BitnobAPI->>LightningNetwork: Create invoice
            LightningNetwork-->>BitnobAPI: Return invoice
            BitnobAPI-->>BitnobSDK: Return invoice data
            BitnobSDK-->>Frontend: Return QR code data
        end

        Frontend->>User: Display QR code for payment

        User->>Frontend: Scan QR and pay
        Frontend->>BitnobSDK: Check payment status
        BitnobSDK->>BitnobAPI: GET /bills/transaction/{id}

        alt Payment successful
            BitnobAPI->>ServiceProvider: Execute service provision
            ServiceProvider-->>BitnobAPI: Confirm completion
            BitnobAPI-->>BitnobSDK: Payment confirmed
            BitnobSDK-->>Frontend: Success response
            Frontend->>User: Display success message
        else Payment failed
            BitnobAPI-->>BitnobSDK: Payment failed
            BitnobSDK-->>Frontend: Error response
            Frontend->>User: Display error message
        end
    else Form is invalid
        Frontend->>User: Display validation errors
    end
```

## Component Architecture

```mermaid
graph TD
    subgraph "Page Components"
        HomePage[Home.tsx]
        AirtimePage[Airtime.tsx]
        DataPage[Data.tsx]
        UtilityPage[UtilityBills.tsx]
        ConfirmPage[Confirm.tsx]
        ContactPage[Contact.tsx]
        NotFoundPage[NotFound.tsx]
    end

    subgraph "Shared Components"
        Navbar[Navbar.tsx]
        FormCard[FormCard.tsx]
        TopUpButton[TopUpButton.tsx]
        TopUpForm[TopUpForm.tsx]
        TransactionStatus[TransactionStatus.tsx]
        DataPlanCard[DataPlanCard.tsx]
    end

    subgraph "UI Components (Shadcn/UI)"
        Button[button.tsx]
        Input[input.tsx]
        Select[select.tsx]
        Card[card.tsx]
        Form[form.tsx]
        Toast[toast.tsx]
        Dialog[dialog.tsx]
        Alert[alert.tsx]
    end

    subgraph "Hooks"
        UseMobile[use-mobile.tsx]
        UseToast[use-toast.ts]
    end

    subgraph "Utilities"
        BitnobLib[bitnob.ts]
        Utils[utils.ts]
    end

    HomePage --> Navbar
    AirtimePage --> Navbar
    AirtimePage --> FormCard
    AirtimePage --> TopUpButton
    AirtimePage --> TransactionStatus
    DataPage --> DataPlanCard
    ConfirmPage --> Button

    FormCard --> Input
    FormCard --> Select
    FormCard --> Button
    TopUpForm --> BitnobLib

    BitnobLib --> Utils
    TransactionStatus --> Toast

    AirtimePage --> UseMobile
    AirtimePage --> UseToast
```

## API Integration Architecture

```mermaid
graph LR
    subgraph "Frontend Application"
        Components[React Components]
        Forms[Form Handlers]
        State[State Management]
    end

    subgraph "Bitnob SDK Layer"
        APIClient[Axios API Client]
        ErrorHandler[Error Handler]
        TypeDefs[TypeScript Interfaces]
        Interceptors[Request/Response Interceptors]
    end

    subgraph "Bitnob Services"
        AirtimeAPI[Airtime Service]
        DataAPI[Data Service]
        ElectricityAPI[Electricity Service]
        CableTVAPI[Cable TV Service]
        LightningAPI[Lightning Service]
        WalletAPI[Wallet Service]
    end

    subgraph "External Infrastructure"
        SandboxEnv[Sandbox Environment]
        ProdEnv[Production Environment]
        LightningNet[Lightning Network]
        ServiceProviders[Service Providers]
    end

    Components --> APIClient
    Forms --> APIClient
    State --> APIClient

    APIClient --> ErrorHandler
    APIClient --> TypeDefs
    APIClient --> Interceptors

    APIClient --> AirtimeAPI
    APIClient --> DataAPI
    APIClient --> ElectricityAPI
    APIClient --> CableTVAPI
    APIClient --> LightningAPI
    APIClient --> WalletAPI

    AirtimeAPI --> SandboxEnv
    AirtimeAPI --> ProdEnv
    DataAPI --> SandboxEnv
    DataAPI --> ProdEnv

    ProdEnv --> LightningNet
    ProdEnv --> ServiceProviders
```

## Backend Integration Flow

```mermaid
flowchart TD
    subgraph "Frontend Layer"
        ReactApp[React Application]
        BitnobClient[Bitnob SDK Client]
    end

    subgraph "Bitnob API Gateway"
        APIGateway[API Gateway]
        Auth[Authentication Layer]
        RateLimit[Rate Limiting]
    end

    subgraph "Bitnob Core Services"
        BillsService[Bills Payment Service]
        LightningService[Lightning Network Service]
        WalletService[Wallet Management]
        TransactionService[Transaction Processing]
    end

    subgraph "External Integrations"
        LightningNetwork[Lightning Network Nodes]
        TelecomProviders[Telecom Providers<br/>MTN, Airtel, Glo, 9mobile]
        UtilityProviders[Utility Providers<br/>EKEDC, IKEDC, AEDC]
        CableProviders[Cable TV Providers<br/>DSTV, GOtv, Startimes]
    end

    subgraph "Infrastructure Layer"
        Database[(Transaction Database)]
        Cache[Redis Cache]
        Queue[Message Queue]
        Monitoring[Monitoring & Logging]
    end

    ReactApp --> BitnobClient
    BitnobClient --> APIGateway

    APIGateway --> Auth
    Auth --> RateLimit
    RateLimit --> BillsService
    RateLimit --> LightningService
    RateLimit --> WalletService

    BillsService --> TransactionService
    LightningService --> TransactionService

    TransactionService --> Database
    TransactionService --> Cache
    TransactionService --> Queue

    BillsService --> TelecomProviders
    BillsService --> UtilityProviders
    BillsService --> CableProviders

    LightningService --> LightningNetwork

    TransactionService --> Monitoring

    Queue --> TelecomProviders
    Queue --> UtilityProviders
    Queue --> CableProviders
```

## Environment Configuration

```mermaid
graph TB
    subgraph "Development Environment"
        DevApp[Development App]
        SandboxAPI[Bitnob Sandbox API]
        MockServices[Mock Payment Services]
        TestData[Test Data & Faucets]
    end

    subgraph "Production Environment"
        ProdApp[Production App]
        ProdAPI[Bitnob Production API]
        LiveServices[Live Payment Services]
        RealBitcoin[Real Bitcoin Lightning]
    end

    subgraph "Configuration Management"
        EnvVars[Environment Variables]
        APIKeys[API Keys Management]
        ConfigFiles[Configuration Files]
    end

    DevApp --> SandboxAPI
    SandboxAPI --> MockServices
    MockServices --> TestData

    ProdApp --> ProdAPI
    ProdAPI --> LiveServices
    LiveServices --> RealBitcoin

    DevApp --> EnvVars
    ProdApp --> EnvVars
    EnvVars --> APIKeys
    EnvVars --> ConfigFiles
```

## Security Architecture

```mermaid
graph TD
    subgraph "Frontend Security"
        HTTPS[HTTPS/TLS Encryption]
        CSP[Content Security Policy]
        CORS[CORS Configuration]
        InputValidation[Input Validation]
    end

    subgraph "API Security"
        APIAuth[API Authentication]
        Bearer[Bearer Token]
        RateLimit[Rate Limiting]
        RequestSigning[Request Signing]
    end

    subgraph "Bitcoin Security"
        Lightning[Lightning Network Security]
        InvoiceValidation[Invoice Validation]
        PaymentVerification[Payment Verification]
        WalletSecurity[Wallet Security]
    end

    subgraph "Data Protection"
        Encryption[Data Encryption]
        NoStorage[No Sensitive Data Storage]
        Logging[Secure Logging]
        Monitoring[Security Monitoring]
    end

    HTTPS --> APIAuth
    InputValidation --> APIAuth
    APIAuth --> Bearer
    Bearer --> RateLimit
    RateLimit --> RequestSigning

    RequestSigning --> Lightning
    Lightning --> InvoiceValidation
    InvoiceValidation --> PaymentVerification
    PaymentVerification --> WalletSecurity

    WalletSecurity --> Encryption
    Encryption --> NoStorage
    NoStorage --> Logging
    Logging --> Monitoring
```

## Technology Stack

| Layer                   | Technology              | Purpose                                 |
| ----------------------- | ----------------------- | --------------------------------------- |
| **Frontend Framework**  | React 18 + TypeScript   | Component-based UI development          |
| **Build Tool**          | Vite                    | Fast development and build process      |
| **Styling**             | TailwindCSS + Shadcn/UI | Utility-first CSS and component library |
| **Routing**             | React Router DOM        | Client-side navigation                  |
| **State Management**    | TanStack Query          | Server state management and caching     |
| **Form Handling**       | React Hook Form + Zod   | Form validation and data handling       |
| **HTTP Client**         | Axios                   | API communication with interceptors     |
| **Payment Integration** | Bitnob SDK              | Bitcoin Lightning payment processing    |
| **QR Code Generation**  | qrcode.react            | Payment QR code display                 |
| **UI Components**       | Radix UI + Lucide React | Accessible components and icons         |

## Key Features

### Payment Processing Flow

1. **Service Selection**: User chooses airtime, data, or utility bills
2. **Form Validation**: Client-side validation using Zod schemas
3. **Payment Request**: Bitnob SDK creates payment request
4. **QR Generation**: Lightning invoice converted to QR code
5. **Payment Execution**: User scans QR and pays via Lightning wallet
6. **Status Monitoring**: Real-time payment status updates
7. **Service Delivery**: Automatic service provisioning upon payment

### Mock Implementation Notes

- **Sandbox Limitation**: Bitnob sandbox cannot decode payment requests
- **QR Code Mocking**: QR codes are generated with mock data for demonstration
- **Test Data**: Uses Nigerian Naira to Satoshi conversion rates
- **Development Mode**: Clear indicators when running in sandbox mode

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Local Development]
        DevServer[Vite Dev Server]
        Sandbox[Bitnob Sandbox]
    end

    subgraph "Staging"
        StagingBuild[Staging Build]
        StagingDeploy[Static Hosting]
        StagingAPI[Staging API]
    end

    subgraph "Production"
        ProdBuild[Production Build]
        CDN[CDN Distribution]
        ProdAPI[Production API]
        Monitoring[Production Monitoring]
    end

    Dev --> DevServer
    DevServer --> Sandbox

    Dev --> StagingBuild
    StagingBuild --> StagingDeploy
    StagingDeploy --> StagingAPI

    StagingBuild --> ProdBuild
    ProdBuild --> CDN
    CDN --> ProdAPI
    ProdAPI --> Monitoring
```

This architecture provides a comprehensive view of how the Bitstra application is structured, from the frontend React components down to the Bitnob API integration and external service providers. The modular design ensures maintainability, scalability, and clear separation of concerns across all layers of the application.
