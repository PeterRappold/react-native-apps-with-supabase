
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { parseDocument, DomUtils } = require("htmlparser2");
const render = require("dom-serializer").default;
const execSync = require("child_process").execSync;

const protoDir = process.argv[2] || "docs/ui/prototypes/workout-app";
const outputDir = process.argv[3] || "processed_prototypes";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let idCounter = 1;
const seenHashes = new Map();
const deduplicatedComponents = [];
const workflowAtoms = [];
const workflowMolecules = [];

function generateHash(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

function processHtmlFiles(dir, outDir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const outFullPath = path.join(outDir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fs.existsSync(outFullPath)) fs.mkdirSync(outFullPath, { recursive: true });
      processHtmlFiles(fullPath, outFullPath);
    } else if (fullPath.endsWith(".html")) {
      const html = fs.readFileSync(fullPath, "utf-8");
      const doc = parseDocument(html);
      
      DomUtils.findAll(elem => {
        const tag = elem.name;
        if (!tag || ["html", "head", "meta", "title", "link", "script", "style", "body"].includes(tag)) return false;
        return true;
      }, doc.childNodes).forEach(elem => {
        const tag = elem.name;
        const innerHtml = render(elem.childNodes);
        const hash = generateHash(innerHtml + tag);
        
        let cddId;
        if (seenHashes.has(hash)) {
           cddId = seenHashes.get(hash);
           elem.attribs["data-agent-id"] = cddId;
        } else {
           cddId = `el-${String(idCounter++).padStart(3, "0")}`;
           seenHashes.set(hash, cddId);
           elem.attribs["data-agent-id"] = cddId;
           
           const type = ["button", "input", "a", "label", "img", "span", "h1", "h2", "h3", "p"].includes(tag) ? "atom" : "molecule_or_organism";
           
           deduplicatedComponents.push({
             id: cddId,
             tag: tag,
             hash: hash,
             html: render(elem)
           });
           
           if (type === "atom") {
             workflowAtoms.push({ id: cddId, status: "pending" });
           } else {
             workflowMolecules.push({ id: cddId, status: "pending" });
           }
        }
      });
      
      const newHtml = render(doc);
      fs.writeFileSync(outFullPath, newHtml);
    } else {
      fs.copyFileSync(fullPath, outFullPath);
    }
  }
}

console.log("Processing prototypes in", protoDir);
processHtmlFiles(protoDir, outputDir);

const workflowProgress = {
  status: "in-progress",
  lastRun: new Date().toISOString(),
  components: {
    atoms: workflowAtoms,
    molecules: workflowMolecules,
    organisms: []
  },
  dependencies: {},
  notes: "Tracking"
};

fs.writeFileSync("work-progress.json", JSON.stringify(workflowProgress, null, 2));
fs.writeFileSync("deduplicated-components.json", JSON.stringify({ components: deduplicatedComponents }, null, 2));

try {
  execSync(`zip -r processed_prototypes.zip ${outputDir}`);
  console.log("Created processed_prototypes.zip");
} catch(e) {
  console.log("Could not create zip");
}
console.log("Done.");
