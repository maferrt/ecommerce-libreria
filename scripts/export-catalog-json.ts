import { mkdirSync, writeFileSync } from "node:fs";
import { catalogData } from "../src/data/catalog";

const outputDir = "backend/src/main/resources/data";
const outputPath = `${outputDir}/catalog.json`;

mkdirSync(outputDir, { recursive: true });

writeFileSync(outputPath, JSON.stringify(catalogData, null, 2), "utf-8");

console.log(`Catálogo exportado correctamente en: ${outputPath}`);
console.log(`Libros: ${catalogData.libros.length}`);
console.log(`Sagas: ${catalogData.sagas.length}`);