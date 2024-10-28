import fs from "fs";
import path from "path";

// Find all artifact files
const srcDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "../src/artifacts",
);
const files = fs.readdirSync(srcDir);
const artifactFiles = files.filter(
  (file) => file.startsWith("artifact-") && file.endsWith(".tsx"),
);

// Read the current App.tsx
const appPath = path.join(path.dirname(srcDir), "App.tsx");
let appContent = fs.readFileSync(appPath, "utf8");

// Create the new KNOWN_ARTIFACTS array
const artifactsArray = artifactFiles.map((file) => `  '${file}'`).join(",\n");
const newKnownArtifacts = `const KNOWN_ARTIFACTS = [\n${artifactsArray}\n];`;

// Replace the existing KNOWN_ARTIFACTS in App.tsx
const knownArtifactsRegex = /const KNOWN_ARTIFACTS = \[([\s\S]*?)\];/;
appContent = appContent.replace(knownArtifactsRegex, newKnownArtifacts);

// Write the updated App.tsx
fs.writeFileSync(appPath, appContent);

console.log("Updated KNOWN_ARTIFACTS with:", artifactFiles);
