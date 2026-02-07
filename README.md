# Manila FAME Registration - Frontend

Vue 3 SPA frontend for the Manila FAME 2026 multi-step event registration system.

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Vuetify 3 (UI framework)
- Pinia (state management)
- Vue Router
- Axios (HTTP client)

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm
- Laravel backend running (see [manila-fame-registration-api](https://github.com/lance-pallesco/manila-fame-registration-api))

## Getting Started

### 1. Install Dependencies

```bash
cd manila-fame-registration-ui
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Set the backend API URL (default assumes Laravel is running on port 8000):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Ensure Backend is Running

The frontend communicates with the Laravel API at the URL configured in `.env`. Make sure the backend server is running before submitting the registration form:

```bash
# In the manila-fame-registration-api directory
php artisan serve
```

## Registration Flow

The application guides users through a 3-step registration process:

```
Step 1: Account Information    Step 2: Company Information    Step 3: Review & Submit
---------------------          ----------------------         -------------------
- First Name                   - Company Name                 - Review all data
- Last Name                    - Year Established             - Edit any step
- Email                        - Website (optional)           - Submit registration
- Username                     - Address
- Password                     - City
- Confirm Password             - Country
- Participation Type           - Region (optional)
                               - Brochure upload (optional)
```

After submission, a Thank You page displays with a reference number (random number).

## Project Structure

```
src/
├── components/
│   ├── forms/
│   │   └── FormSection.vue           # Reusable form section wrapper
│   └── ui/
│       ├── BaseFileUpload.vue        # File upload component
│       ├── BaseInput.vue             # Text input wrapper
│       └── BaseSelect.vue            # Select dropdown wrapper
├── composables/
│   └── useRegistration.js            # Registration logic & validation
├── constants/
│   └── registration.js               # Steps config, validation rules
├── layouts/
│   └── DefaultLayout.vue             # App layout with header/footer
├── pages/
│   └── RegistrationPage.vue          # Main page (step orchestrator)
├── plugins/
│   └── vuetify.js                    # Vuetify configuration
├── router/
│   └── index.js                      # Vue Router setup
├── services/
│   ├── apiClient.js                  # Axios instance with interceptors
│   ├── countriesService.js           # Country list from REST Countries API
│   └── registrationService.js        # POST /api/register submission
├── stores/
│   └── registrationStore.js          # Pinia store (form state)
├── templates/
│   └── MultiStepLayout.vue           # Stepper layout with navigation
├── utils/
│   └── validators.js                 # Pure validation functions
├── views/
│   └── registration/
│       ├── AccountInformation.vue    # Step 1
│       ├── CompanyInformation.vue    # Step 2
│       ├── RegistrationSummary.vue   # Step 3
│       └── ThankYou.vue              # Post-submission page
├── App.vue
└── main.js
```

## How It Works

### State Management

All form data is stored in a Pinia store (`registrationStore.js`). Data persists across step navigation so users can go back and forth without losing input.

### Validation

Two layers of validation protect data quality:

1. **Client-side (Vuetify rules)** -- real-time feedback as the user types
2. **Programmatic validation** -- runs when clicking "Continue" to block navigation if fields are invalid

On final submission, the Laravel backend performs server-side validation and returns 422 errors if anything is invalid. The `apiClient.js` interceptor maps Laravel's `account_info.first_name` error keys back to the frontend's `firstName` format.

### API Communication

The frontend sends all data in a single `POST /api/register` request as `multipart/form-data`. The `registrationService.js` converts camelCase field names to snake_case and nests them as Laravel expects:

```
accountInfo.firstName  -->  account_info[first_name]
companyInfo.companyName -->  company_info[company_name]
brochure (File)        -->  brochure
```

## Connecting to the Backend

| Frontend (.env)                        | Backend                  |
|----------------------------------------|--------------------------|
| `VITE_API_BASE_URL=http://localhost:8000/api` | `php artisan serve` on port 8000 |

The backend must have CORS configured to accept requests from the frontend origin. This is already set up in the backend's `config/cors.php` to allow `http://localhost:5173`.
