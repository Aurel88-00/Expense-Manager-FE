## Expense Management System

## How to run the app
```
npm install
cd app-directory 
npm run dev
```

## Technical Expectations

* State Management: Utilizing React's useState and useReducer for application state, combined with custom hooks for managing side effects and derived data (useBudgetStatus).

* Component Organization: Modular components based on application-specific features (DDD: Domain-driven design).

* Error Handling: 1. Robust global error handling for the API response-request cycle using `Axios` 2. Robust visual error management using `ErrorBoundary` 3. Local level error handling 4. Store-level error handling using `React Query`

* Loading States: Display visual loading indicators (spinners) during async operations like fetching data or calling the AI service.

* Aesthetics: Utilizing Tailwind CSS for a fully responsive, clean, modern design and theming capabilities.

## How to find your way around the application
The application has three features:
* Dashboard which features general data about teams, expenses, and charts their budgets and expenditures>
* Teams that feature all the teams and their budget status. The user is allowed to manage teams by changing their members, deleting, adding, or updating the teams.
* Expenses, the same as the teams, but here the user can do more things, like filter the expenses based on certain criteria like status, team name, etc., delete many expenses at once, and convert the expenses to a PDF file.


