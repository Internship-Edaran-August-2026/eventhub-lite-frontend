# EventHub Lite — Git Command Guide

A quick-reference for the day-to-day git workflow you'll use while working
through your sprint tasks in `eventhub-lite`. Keep this open in a tab until
these commands become muscle memory.

## The standard feature workflow

Every task follows the same shape: start from a clean `main`, branch off,
commit your work, push it, open a PR, then clean up once it's merged.

```
main ──●───────────────●──────────────────────────► (stays clean, always deployable)
        \               ▲
         \              merge (via PR review)
          ●──●──●──●──●/
          feature/sprint-1-login
```

## Command reference

| `git checkout main` | Switch your local working environment to the primary branch (`main`). |
| `git pull origin main` | Fetch and merge the latest code changes from the remote server into your local `main`. |
| `git checkout -b <branch-name>` | Create a new feature branch and immediately switch to it (e.g., `feature/sprint-1-login`). |
| `git status` | Check the current state of your working directory (shows modified, staged, or untracked files). |
| `git add .` | Stage all modified and new files to prepare them for the next commit. |
| `git commit -m "<message>"` | Save your staged changes locally with a descriptive commit message (e.g., `feat: add login form validation`). |
| `git push -u origin <branch-name>` | Push your local feature branch to the remote repository (GitHub) and prepare it for a Pull Request (PR). |
| `git push` | Push any subsequent local commits to the already linked remote branch. |
| `git branch -d <branch-name>` | Delete a local feature branch after its changes have been reviewed and merged into `main`. |

## Step-by-step: starting a new sprint task

1. **Start clean, from `main`:**
   git checkout main
   git pull origin main

2. **Create your feature branch** — name it after the sprint/task you're on:
   git checkout -b feature/sprint-1-login
   
3. **Work normally**, then check what changed before staging anything:

   git status

4. **Stage and commit** — write commit messages in the `type: description`
   format used across this repo (`feat:`, `fix:`, `docs:`, `chore:`):

   git add .
   git commit -m "feat: add login form validation"

5. **Push your branch** — the `-u` links your local branch to the remote one,
   so every push after this first one is just `git push`:

   git push -u origin feature/sprint-1-login

6. **Open a Pull Request** on GitHub from your branch into `main`, and link it
   to the matching Sprint issue on the project board.
7. **After your PR is reviewed and merged**, delete the local branch to keep
   things tidy:

   git checkout main
   git pull origin main
   git branch -d feature/sprint-1-login


## Do's and Don'ts

- **Do** pull `main` before creating a new branch every time — starting from
  stale code is the #1 cause of avoidable merge conflicts.
- **Do** commit often, in small logical chunks, rather than one giant commit
  at the end of the sprint.
- **Do** name branches after the sprint/task, e.g. `feature/sprint-3-auth-context`,
  `fix/sprint-8-mobile-nav` — this makes it obvious which board item a branch
  belongs to.
- **Don't** commit directly to `main` — always work on a feature branch and
  go through a PR, even for small changes.
- **Don't** run `git push --force` on a shared branch unless
  specifically asks you to — it can overwrite someone else's work.
- **Don't** run `git branch -d <branch-name>` until the PR is actually merged
  — `-d` (lowercase) will safely refuse to delete an unmerged branch anyway,
  which is your safety net if you're ever unsure.
