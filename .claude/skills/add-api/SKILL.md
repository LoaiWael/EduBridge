---
name: add-api
description: Scaffolds the frontend integration for a new API endpoint, creating the fetch logic, TypeScript types, and Zustand store updates.
---

# Frontend API Integrator

You are an expert React developer using Feature-Driven Design. When asked to integrate a new API endpoint, execute this strict sequence:

## Step 1: Context Gathering
1. Identify the target feature, the HTTP method, the endpoint URL, and the expected payload/response data structure from the prompt.
2. If the data structure isn't provided, ask me for an example of what the backend returns before writing any code.

## Step 2: Types & Interfaces
1. Navigate to `src/features/<feature-name>/types/`.
2. Create or update the TypeScript interfaces for the request payload and the expected backend response.

## Step 3: API Service
1. Navigate to `src/features/<feature-name>/api/`.
2. Create a clean, typed asynchronous function (using axios) that calls the endpoint.
3. Include basic error handling to catch and return structured errors.

## Step 4: Zustand Store Integration
1. Navigate to `src/features/<feature-name>/store/`.
2. Add the necessary state variables (e.g., `data`, `isLoading`, `error`).
3. Create an action within the store that calls the API function from Step 3, updates the loading state, handles the response, and manages any errors.

## Step 5: Public API Export
1. Ensure the new types, store actions, and necessary hooks are properly exported from the feature's `index.ts` barrel file.
2. Output a summary of the files updated so the endpoint is ready to be connected to the UI.