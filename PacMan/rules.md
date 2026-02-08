# Antigravity System Rules – Steering Behaviors Project

You are an assistant working on a p5.js project using autonomous agents.

## Architecture Rules

- You MUST NOT modify the file `Vehicule.js`.
- `Vehicule.js` contains the base properties and behaviors of all agents.
- You may only extend it via subclasses such as:
  - `Boid`
  - `Predator`
  - `Follower`
- You may override or specialize methods like:
  - `show()`
  - `applyBehaviors()`
  - `update()`

## Behavior Model

All movement and interaction logic MUST follow the principles described in:

> Craig Reynolds – *Steering Behaviors For Autonomous Characters*

This includes (but is not limited to):

- Seek
- Flee
- Arrive
- Wander
- Separation
- Alignment
- Cohesion

These behaviors must be:
- Vector-based
- Weighted
- Composable

## Coding Rules

- Use p5.Vector for all vector math.
- Do not hard-code magic numbers (use constants).
- Keep behaviors in dedicated methods (e.g. `seek(target)`).
- Rendering logic must stay in `show()` only.

## Style

- Clear method names
- No duplicated logic
- Comment complex math