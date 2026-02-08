# Survivor.io Game Design Document

## 🎮 What is Survivor.io?
Survivor.io is a top-down action survival game where the player must survive as long as possible against endless waves of enemies. The core idea is **movement + positioning**, not manual shooting.

## 🕹️ Core Gameplay Loop
1. Move the character
2. Enemies spawn and chase the player
3. Weapons attack automatically
4. Enemies drop experience
5. Player levels up and chooses upgrades
6. Difficulty increases
7. Repeat until death

## 👤 Player Controls
- **Movement Only**: Virtual joystick or WASD/Arrows.
- **No Manual Aiming**: Attacks happen automatically.
- **Skill**: Positioning and movement strategy are key.

## 🧍 Player Character
- Health points (HP)
- Movement speed
- Level & Experience bar
- Automatic weapons inventory

## ⚔️ Weapons & Attacks
Weapons trigger automatically on a timer.
**Examples**:
- Projectiles (Wand)
- Orbiting shields
- Boomerangs
- Lasers
- Chain lightning

**Upgrades**: Damage, Speed, Count, Range.

## 👹 Enemies
Enemies spawn continuously and swarm the player.
**Types**:
- Slow basic enemies
- Fast enemies
- Tanky enemies
- **Bosses** (At specific intervals)

## ⭐ Experience & Leveling
- Enemies drop **XP Orbs**.
- Full XP bar checks **Level Up**.
- **Upgrades**: Choose 1 of 3 options (New weapons or Stats).

## 📈 Difficulty Scaling
- Dynamic spawn rate increase.
- Enemy stats increase over time.
- New enemy types unlock.

## 🎯 Win & Lose Conditions
- **Lose**: Health reaches zero.
- **Win**: Survive until time limit or defeat final boss.

## 🎨 Visual Style
- Top-down 2D.
- Clear silhouettes.
- Flashy effects.
- High entity count (swarms).
