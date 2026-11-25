# The development cycle

How work runs in Shelf, for every agent. The cycle is Gradatim's, as [AGENTS.md](../../AGENTS.md) says.

- A task is designed, built and closed in the order of its sprint's board, one at a time.
- A task's id is its module's code and a number:

  ```
  <CODE>-<n>, such as INF-9
  ```

- Work happens on a branch named after the task, such as `cat-1-search-by-isbn`, and goes in through a pull request.
- A problem that needs thought, not a quick fix, goes to `docs/issues/`.
