Q: Explain `git rebase` vs `git merge` and when to use each in a production team workflow.
A:
- **`git merge`:** Creates a new **Merge Commit** combining two branch histories. Preserves exact history and branch timelines, but can pollute git log with multiple merge commits.
- **`git rebase`:** Re-applies commits from your feature branch on top of the target branch, creating a clean linear git history without extra merge commits. Rewrites commit hashes!

**Golden Rule:** NEVER rebase shared public/main branches. Rebase feature branches locally before merging into `main`.

```bash
# Rebase feature branch onto latest main
git checkout feature/user-auth
git fetch origin
git rebase origin/main

# If conflicts occur, resolve files then:
git add .
git rebase --continue
```
---
Q: How do you recover a deleted branch or lost commits using `git reflog`?
A: `git reflog` tracks every reference update (commit, checkout, rebase, reset) made in your local repository, even if commits were detached or branches deleted.

**Recovery Steps:**
1. Run `git reflog` to find the HEAD commit hash prior to deletion (e.g. `HEAD@{4}`).
2. Restore branch: `git checkout -b recovered-branch HEAD@{4}`.

---
Q: What is `git cherry-pick` and when should you use it?
A: `git cherry-pick <commit-hash>` applies a specific commit from another branch onto your current branch without merging the entire branch.

**Use Case:** Hotfixing a production issue by picking a single bugfix commit from a `dev` or `feature` branch into `release` or `main`.
---
Q: Explain `git reset --soft` vs `git reset --mixed` vs `git reset --hard`.
A:
- **`--soft`:** Moves `HEAD` pointer back. Leaves changes staged in **Index / Staging Area**. No work lost.
- **`--mixed` (Default):** Moves `HEAD` pointer back. Unstages changes into **Working Directory**. No work lost.
- **`--hard`:** Moves `HEAD` pointer back AND discards all uncommitted working directory & staging changes. Destructive!
---
Q: How does `git bisect` work to find which commit introduced a bug?
A: `git bisect` uses Binary Search across commit history to isolate the exact commit that broke the build:

```bash
git bisect start
git bisect bad                 # Current commit is broken
git bisect good v1.2.0         # Last known working commit/tag

# Git checks out midpoint commit automatically. Test app, then run:
git bisect good # OR git bisect bad

# Once identified, finish with:
git bisect reset
```
