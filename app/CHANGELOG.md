# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- **HOTFIX: Voronoi Map Dependency Crash**
  - Resolved "Dual ThreeJS" conflict between `react-force-graph-3d` and `@react-three/fiber` by forcing `three` version optimization in `package.json`.
  - Fixed WebGL context loss issues impacting `StrategicVoronoiMap`.
