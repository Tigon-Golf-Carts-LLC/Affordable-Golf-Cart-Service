# Lead form browser regression tests


## Running locally and in CI

`npm run test:browser` runs the original Chromium desktop and Pixel projects.
`npm test` also runs the existing field and server tests. Run
`npm run check:browser` to type-check the tests and configuration.

On a supported host, download all matching browser runtimes with
`npm run test:browser:install`, then run **all five projects** with
`npm run test:browser:all`. On a fresh Ubuntu 24.04 runner use
`npx playwright install --with-deps chromium firefox webkit` to include system
libraries. To select one engine, use e.g.
`npm run test:browser:all -- --project=firefox`.

`.github/workflows/inquiry-cross-browser.yml` runs the complete suite separately
for Firefox, desktop WebKit, and iPhone/WebKit on Ubuntu 24.04 with Node 22, on
pull requests, pushes, and manual dispatch. It installs only the
matching browser for each job, reports each engine independently without
fail-fast or retries, and saves failure screenshots/traces for seven days.
These jobs complement the Chromium checks; they do not publish the site.

Replit/NixOS uses the wrapped `chromium` package configured in `.replit` for
the two local Chromium projects. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` affects
**only** those projects. Do not point Firefox or WebKit at a stock browser or
run Debian dependency installation on Nix: use the supported Ubuntu CI jobs
for their Playwright-patched runtimes. No engine tests are silently skipped in
the all-browser command.

## GitHub Actions

`.github/workflows/inquiry-checks.yml` runs on every pull request and push,
and can be started manually. It uses Node.js 20, `npm ci`,
`playwright install --with-deps chromium`, `npm run check`,
`npm run check:browser`, and `npm test` (unit tests followed by both browser
projects). No webhook secrets or deployment credentials are provided.
CI rejects focused tests (`test.only`) so the suite cannot accidentally be skipped.
The frontend-only server and default-deny fixture are unchanged.

Failed runs upload `test-results/` as an `inquiry-failure-*` artifact, retained
for 14 days. Download and unzip the artifact from the Actions run to inspect
screenshots or open its trace ZIP with `npx playwright show-trace <trace.zip>`.
Failures before browser tests start may have no browser artifacts.

To actually block merges, a repository administrator must require the
`Inquiry and Contact regression` check in the protected branch's ruleset or
branch protection settings. The workflow intentionally has no path filters,
which can otherwise leave a required check pending on unrelated changes.
Do not enable publication until this check passes; a separate publishing
workflow must depend on successful checks rather than run independently.
This workflow checks changes but does not publish the site.

`scripts/post-merge.sh` runs both type checks and `npm test` before building.
On Replit it uses the configured Nix Chromium; elsewhere install Chromium and
its supported Linux dependencies before running that script.

## Delivery safety

The suite starts its own frontend-only Vite server on port 4173; it never uses
the Express server, a published site, or webhook credentials. The automatic
fixture refuses any base URL other than the isolated localhost origin,
intercepts both lead endpoints, blocks every other non-GET/HEAD request,
blocks external requests, and disables service workers. Tests use synthetic
names and reserved `.invalid` email addresses.
`vite.browser.config.ts` overrides the static site's hosted relay URLs with
local intercepted endpoints; never remove this override or use a live relay.

The delivery-safety regression checks unknown local writes and external
reads/writes are blocked. No CI job receives delivery secrets.


## Assertions

Each test has a fresh browser context. Every project runs the same tests, with
no engine-specific skips or weaker assertions. Inquiry drafts are tested in
sessionStorage through close/reopen, reload and route changes; uploaded files
must not be restored from storage.

Coverage: global triggers across route types and scrolled pages, accessible
labels and keyboard focus/dismissal, native required/email/phone validation,
three multipart uploads and local rejection, draft recovery/storage failures,
pending request protection, error recovery, successful reset and form isolation
on Contact. Required-field validation asserts the focused input and native
validity flags, not browser-localized tooltip text. Submission assertions decode
the actual browser-generated multipart request and check file names, MIME types,
and contents.

Failures retain screenshots and traces in ignored `test-results/`.
Inspect a trace with `npx playwright show-trace <trace.zip>`.

## Browser coverage versus real devices

| Project | Runtime | Device coverage |
| --- | --- | --- |
| `desktop` | Chromium | Desktop Chrome profile |
| `mobile` | Chromium | Pixel 7 viewport/touch emulation |
| `firefox` | Playwright Firefox | Desktop Firefox profile |
| `webkit` | Playwright WebKit | Desktop Safari profile |
| `iphone-webkit` | Playwright WebKit | iPhone 13 viewport/touch/UA emulation |

WebKit is not installed Apple Safari. iPhone/WebKit emulation does **not**
test a physical iPhone, iOS keyboard, camera/photo picker, or OS-specific Safari
behavior. File inputs are populated by automation, not an OS picker. Physical
device checks remain separate, and must also target a non-delivering test host.
