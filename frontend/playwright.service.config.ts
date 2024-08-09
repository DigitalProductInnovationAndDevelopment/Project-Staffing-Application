/*
* This file enables Playwright client to connect to remote browsers.
* It should be placed in the same directory as playwright.config.ts.
*/

import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Define environment on the dev box in .env file:
//  .env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN=XXX
//    PLAYWRIGHT_SERVICE_URL=XXX

// Define environment in your GitHub workflow spec.
//  env:
//    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
//    PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
//    PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}


// Name the test run if it's not named yet.
process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();

// Can be 'linux' or 'windows'.
const os = process.env.PLAYWRIGHT_SERVICE_OS || 'linux';

export default defineConfig(config, {
  // Define more generous timeout for the service operation if necessary.
  // timeout: 60000,
  // expect: {
  //   timeout: 10000,
  // },
  workers: 20,

  // Enable screenshot testing and configure directory with expectations.
  // https://learn.microsoft.com/azure/playwright-testing/how-to-configure-visual-comparisons
  ignoreSnapshots: false,
  snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${os}/{arg}{ext}`,
  
  use: {
    // Specify the service endpoint.
    connectOptions: {
      wsEndpoint: `${'wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_8f47e7eb-eeac-4e41-bd73-d14482360f2c/browsers'}?cap=${JSON.stringify({
        // Can be 'linux' or 'windows'.
        os,
        runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID
      })}`,
      timeout: 30000,
      headers: {
        'x-mpt-access-key': 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFiNjQ1NDMwNDZhNTQ4NzU4ZDEzNDZkZDBiYTQ0ZjM3IiwidHlwIjoiSldUIn0.eyJhaWQiOiJ3ZXN0ZXVyb3BlXzhmNDdlN2ViLWVlYWMtNGU0MS1iZDczLWQxNDQ4MjM2MGYyYyIsInN1YiI6InBsYXl3cmlnaHRzZXJ2aWNlYWNjZXNza2V5IiwiaWQiOiI3MTU5M2E5OC1lMjJiLTQ2YzgtODRhMC1kNTkwM2QwZmU2N2QiLCJzY29wZSI6InRlc3RleGVjdXRpb24iLCJ2ZXIiOiIxLjAiLCJ1c2VyTmFtZSI6Ikx1Y2EgRm9iZXIiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81ZDdiNDllOS01MGQyLTQwZGMtYmFiMS0xNGEyZDkwMzU0MmMvIiwiYXBwaWQiOiJiMWZkNGViZi0yYmVkLTQxNjItYmU4NC05N2UwZmU1MjNmNjQiLCJhcHBpZGFjciI6IjAiLCJncm91cHMiOlsiMTZmYjRjMDMtNTVlZi00MGY2LWI0OTktYTFhOWEzZTUzMDc4IiwiY2RlM2M1MDgtODc2My00ZjA5LTk3NDMtOTg4ZDgwM2ZjNjVhIiwiMDY2MjkwMGQtYmM3OC00ZGYxLWE4NWItMzA2NDZlODU4ZjUyIiwiMjU5MWQwMmItOTZkOC00Y2NkLWJiNjAtYWRhOWJiYzAyYThlIiwiMDhlZmQ5YjItN2ExMS00NjZmLWI5NTktMThiNmMzYzQzZjNiIiwiZWI5ODk0YzEtZjQ4YS00NjNlLTg3ZTUtMzNjMzBlNDYyZmE1IiwiZDAxMmU3YzctYjBiYi00NGE0LTgzMjQtZTYwZDU3ZTg1OWEyIiwiNjZjZDZmZDctNjFjZS00NDYxLTg1NDYtM2NlNTRmZTIzNDA4IiwiYmMyZTUxZWYtNzk0NC00NjAyLWFhNWYtMDdiMjczNTJiOTA5IiwiNWYxNTdhZjAtNjIzOS00OTE1LTllYmEtNDQyMGFiMTI4OTBjIl0sIm9pZCI6IjFhMzJlZDliLTc2ODQtNGYxZC04ZjNjLTg4MGNlNjBlY2UwNyIsInB1aWQiOiIxMDAzMjAwMTE0OTExRkM4Iiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwidGlkIjoiNWQ3YjQ5ZTktNTBkMi00MGRjLWJhYjEtMTRhMmQ5MDM1NDJjIiwid2lkcyI6ImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSIsIm5iZiI6MTcyMzEzODE3NSwiZXhwIjoxNzI1NzMwMTc0LCJpYXQiOjE3MjMxMzgxNzV9.0E7WTYWInqyO64lZJ9aBIU5GHQY-6fUnOPR17kuCsD5oeYCoOaxoN7_RUt5VI6H5GYpD9kpcd1L3STClSAfBbWAcMzpt4cHdjCWPjAV92M76xnvc76GvFI09HiuSF0z8qSFPwJNIaFaJmwWqlO2_IiLs4ersBDJ1q0eW-1I5t9nTkewMttFgGgOqXCScTGXHnqTSFuLTKLrf-rHN3dnA5IVudjRcQA2kdQK_6YQocp36htukWXDcfx-wA-PH7R4Nh4ysPg2G7mCNbDHbRMzV4CF9D7XVvwd4LKONZTzR_olRfMmONQOfvX4Pc-g4cRePMysjqxf488kTBZsIRPJw2w'!
      },
      // Allow service to access the localhost.
      exposeNetwork: '<loopback>'
    }
  },
  // Tenmp workaround for config merge bug in OSS https://github.com/microsoft/playwright/pull/28224
  projects: config.projects? config.projects : [{}]
});