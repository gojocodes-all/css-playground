# Maintenance log

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
