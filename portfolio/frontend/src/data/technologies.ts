import {
  siTypescript,
  siReact,
  siDotnet,
  siOpenjdk,
  siKotlin,
  siSwift,
  siPython,
  siC,
  siMysql,
  siGit,
} from "simple-icons";
import type { ITechnology } from "../interfaces/ITechnology";

// Logoene kommer fra simple-icons. C# og Java finnes ikke der,
// så de vises med .NET- og OpenJDK-logoene.
export const technologies: ITechnology[] = [
  { name: "TypeScript", path: siTypescript.path, color: `#${siTypescript.hex}` },
  { name: "React", path: siReact.path, color: `#${siReact.hex}` },
  { name: "C# / .NET", path: siDotnet.path, color: `#${siDotnet.hex}` },
  { name: "Java", path: siOpenjdk.path, color: `#${siOpenjdk.hex}` },
  { name: "Kotlin", path: siKotlin.path, color: `#${siKotlin.hex}` },
  { name: "Swift", path: siSwift.path, color: `#${siSwift.hex}` },
  { name: "Python", path: siPython.path, color: `#${siPython.hex}` },
  { name: "C", path: siC.path, color: `#${siC.hex}` },
  { name: "MySQL", path: siMysql.path, color: `#${siMysql.hex}` },
  { name: "Git", path: siGit.path, color: `#${siGit.hex}` },
];
