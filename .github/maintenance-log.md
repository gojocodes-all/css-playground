# Maintenance log

## 2026-10-20 — Generate the standalone build deterministically

- **Rationale:** FlexLab ships modular and one-file versions, but contributors had to copy every HTML, CSS, and JavaScript change into the 89 KB standalone document by hand. CI checked syntax and a few shared behaviors without proving that both builds contained the same sources, so a valid edit could silently leave one version stale.
- **Files changed:** Added `scripts/build-standalone.js` and `test/standalone-build.test.js`; updated `scripts/check-syntax.js`, `package.json`, `README.md`, and this maintenance log.
- **Changes:** Make the modular files the source of truth; add a dependency-free generator and freshness check; preserve replacement-like JavaScript tokens literally; reject missing or duplicate source markers; validate every JavaScript file automatically; and document the generated-file workflow.
- **Validation:** Confirmed the generated output exactly matches the existing `flexlab-standalone.html`; `npm run validate` runs the freshness gate, syntax checks, and ten regression tests in GitHub Actions; complete diff reviewed for runtime equivalence, security, accessibility, backward compatibility, and repository conventions.
- **Risk:** Low. Application HTML, CSS, JavaScript behavior, dependencies, permissions, and deployment configuration are unchanged. The committed standalone file is byte-for-byte identical to the generator output.
- **Rollback:** Revert this pull request to restore the manual synchronization workflow.

## 2026-10-14 — Report clipboard failures accurately

- **Rationale:** When the modern Clipboard API was unavailable, FlexLab ignored the legacy copy command's boolean result and always announced success. Browsers can reject that fallback without throwing, particularly when the documented standalone file is opened directly, leaving users with uncopied code and misleading feedback.
- **Files changed:** `script.js`, `flexlab-standalone.html`, `test/accessibility.test.js`, and `.github/maintenance-log.md`.
- **Validation:** Compiled both JavaScript implementations; evaluated all six dependency-free regression assertions; verified the modular and standalone copy implementations are identical; reviewed the complete diff. The hosted `npm run validate` result is recorded on the pull request.
- **Risk:** Low. Successful modern and fallback copies retain the existing behavior. Only failed copies change: the generated code is selected and the live status asks the user to use the browser's copy command.
- **Rollback:** Revert this pull request to restore the previous unconditional fallback success message.

## 2026-10-08 — Automate complete FlexLab validation

- **Rationale:** The repository had dependency-free regression tests and documented manual syntax checks, but no single validation command or hosted pull-request gate. A malformed standalone inline script or skipped local test could reach `main` unnoticed.
- **Files changed:** Added `scripts/check-syntax.js` and `.github/workflows/validate.yml`; updated `package.json`, `README.md`, and this maintenance log.
- **Validation:** Ran `npm run validate` (syntax validation plus four Node.js tests); parsed `package.json` and the workflow YAML; verified the standalone document contains exactly one inline script; reviewed the complete diff.
- **Risk:** Low. Application HTML, CSS, and runtime JavaScript are unchanged. The workflow has read-only permissions, immutable action revisions, no persisted credentials, no dependency installation, and a five-minute timeout.
- **Rollback:** Revert this pull request to remove the workflow and validation script and restore the previous manual commands.

## 2026-10-03 — Document validation and contribution workflow

- **Rationale:** The README described how to open FlexLab but omitted its Node.js requirement, test command, regression-test coverage, test directory, and the requirement to keep the modular and standalone implementations synchronized.
- **Files changed:** `README.md` and `.github/maintenance-log.md`.
- **Validation:** Ran `npm test`, `node --check script.js`, a standalone inline-script syntax check, README path and command checks, and `git diff --check`.
- **Risk:** Low. Documentation and maintenance history only; application code and runtime behavior are unchanged.
- **Rollback:** Revert this change to restore the previous shorter README and maintenance log.

## 2026-09-22 — Accessible control tabs

- **Rationale:** The four control sections looked like tabs but were exposed as unrelated buttons and could only be switched by clicking. Keyboard and assistive-technology users lacked tab semantics, state, relationships, and arrow-key navigation.
- **Files changed:** `index.html`, `script.js`, `flexlab-standalone.html`, `package.json`, and `test/accessibility.test.js`.
- **Validation:** `npm test`, `node --check script.js`, standalone inline-script syntax check, and `git diff --check`.
- **Risk:** Low. The existing click behavior and visual classes remain unchanged; the update adds semantic state and keyboard behavior.
- **Rollback:** Revert this change to restore the previous click-only tab implementation.
