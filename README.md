# Bitstra - Project Build Guide

## Overview 

Bitstra is a Bitcoin Lightning Network payment application that enables users to pay for airtime, data plans, and utility bills in Nigeria. The project is built using React, TypeScript, Vite, TailwindCSS, and integrates with the Bitnob API for Bitcoin Lightning payments.

## Architecture 

The application follows a modern React architecture with the following key components:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: TailwindCSS with custom theme and Shadcn/ui components
- **Routing**: React Router DOM for client-side navigation
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Payment Integration**: Bitnob API for Bitcoin Lightning payments
- **QR Code Generation**: Mock implementation due to Bitnob sandbox limitations

## Prerequisites

Before building the project, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control

## Project Structure

```
bitstra-v1/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui component library
│   │   ├── DataPlanCard.tsx
│   │   ├── FormCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── TopUpButton.tsx
│   │   ├── TopUpForm.tsx
│   │   └── TransactionStatus.tsx
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── bitnob.ts       # Bitnob API integration
│   │   └── utils.ts        # General utilities
│   ├── pages/              # Application pages/routes
│   │   ├── Airtime.tsx
│   │   ├── Data.tsx
│   │   ├── UtilityBills.tsx
│   │   ├── Confirm.tsx
│   │   ├── Contact.tsx
│   │   ├── Home.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Global styles
│   └── .env                # Environment variables
├── public/                 # Static assets
├── docs/                   # Documentation files
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── components.json         # Shadcn/ui configuration
```

## Build Steps

### 1. Clone and Setup

```bash
git clone <repository-url>
cd bitstra-v1
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- **Core Dependencies**:
  - React 18.3.1
  - React DOM 18.3.1
  - TypeScript 5.8.3
  - Vite 5.4.19

- **UI/Styling Dependencies**:
  - TailwindCSS 3.4.17
  - Radix UI components
  - Lucide React icons
  - Class Variance Authority for component variants

- **Functionality Dependencies**:
  - React Router DOM for navigation
  - TanStack Query for API state management
  - React Hook Form with Zod validation
  - Axios for HTTP requests
  - QRCode libraries for payment QR generation

### 3. Environment Configuration

Create or verify the `.env` file in the `src` directory:

```env
VITE_BITNOB_API_KEY=your_bitnob_api_key
VITE_BITNOB_BASE_URL=https://sandboxapi.bitnob.com/api/v1
VITE_BITNOB_ENV=sandbox
MODE=development
```

**Note**: The project uses Bitnob sandbox environment. In sandbox mode, payment request decoding has limitations, so QR code generation is mocked for demonstration purposes.

### 4. Development Server

Start the development server:

```bash
npm run dev
```

This will:
- Start Vite development server on port 8080
- Enable hot module replacement
- Serve the application at `http://localhost:8080`

### 5. Production Build

For production deployment:

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles all assets using Vite
- Optimizes code for production
- Outputs build files to `dist/` directory

### 6. Development Build

For development environment build:

```bash
npm run build:dev
```

### 7. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### 8. Code Quality

Run ESLint for code quality checks:

```bash
npm run lint
```

## Key Configuration Files

### Vite Configuration (`vite.config.ts`)

- Configures React SWC plugin for fast compilation
- Sets up path aliases (`@` points to `src` directory)
- Configures development server on port 8080

### TailwindCSS Configuration (`tailwind.config.ts`)

- Extends default theme with custom colors
- Configures CSS variables for theming
- Includes animations and component styling
- Integrates with Shadcn/ui design system

### TypeScript Configuration

- `tsconfig.json`: Main TypeScript configuration
- `tsconfig.app.json`: Application-specific settings
- `tsconfig.node.json`: Node.js environment settings

## API Integration

### Bitnob SDK Integration

The project integrates with Bitnob's Bitcoin Lightning API through `src/lib/bitnob.ts`:

- **Sandbox Environment**: Uses sandbox API for development
- **Payment Methods**: Supports airtime, data plans, and utility bill payments
- **QR Code Limitation**: Due to sandbox limitations in payment request decoding, QR codes are mocked
- **Error Handling**: Comprehensive error handling for API failures

### Mock QR Implementation

Since Bitnob sandbox cannot decode payment requests properly, the application includes:

- Mock QR code generation for demonstration
- Simulated payment flow
- Test transaction data

## Deployment Considerations

### Environment Variables

For production deployment, ensure:

- Use production Bitnob API credentials
- Set `VITE_BITNOB_ENV=production`
- Update base URL to production endpoint

### Build Optimization

The production build includes:

- Tree shaking for unused code elimination
- Code splitting for optimal loading
- Asset optimization and compression
- TypeScript compilation with type checking

### Static Hosting

The built application can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Development Guidelines

### Component Structure

- Use functional components with TypeScript
- Implement proper prop typing
- Follow Shadcn/ui component patterns
- Maintain consistent styling with TailwindCSS

### State Management

- Use TanStack Query for server state
- React Hook Form for form state
- Local state with useState for UI state

### Code Quality

- Follow ESLint configuration
- Use TypeScript strict mode
- Implement proper error boundaries
- Write descriptive component and function names

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 8080 is in use, modify `vite.config.ts`
2. **Environment Variables**: Ensure `.env` file is in `src` directory
3. **Dependencies**: Run `npm install` if modules are missing
4. **Build Errors**: Check TypeScript errors in terminal output

### Bitnob Integration Issues

- Verify API credentials in environment variables
- Check network connectivity for API calls
- Review Bitnob documentation for endpoint changes
- Use sandbox environment for development

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Bitnob API Documentation](https://docs.bitnob.com/)
- [Shadcn/ui Components](https://ui.shadcn.com/)