#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { parseString } = require("xml2js");

function timeStampToVTT(ttmlTime) {
  // Convert TTML time format (HH:MM:SS.mmm) to VTT format (HH:MM:SS.mmm)
  // TTML uses format like "00:00:02" or "00:00:05.080"
  let result = ttmlTime;
  if (!result.includes(".")) {
    result += ".000";
  }
  return result;
}

function cleanText(text) {
  if (!text) return "";

  // Handle different text structures from TTML
  if (Array.isArray(text)) {
    return text.map(cleanText).join(" ");
  }

  if (typeof text === "object") {
    if (text._) {
      return cleanText(text._);
    }
    if (text.span) {
      return cleanText(text.span);
    }
    return "";
  }

  return text.toString().trim();
}

function extractTextFromSpan(span) {
  if (!span) return "";

  if (Array.isArray(span)) {
    return span.map(extractTextFromSpan).join(" ");
  }

  if (typeof span === "object") {
    if (span._) {
      return span._.trim();
    }
    if (span.span) {
      return extractTextFromSpan(span.span);
    }
  }

  return span.toString().trim();
}

function convertTTMLToVTT(ttmlContent) {
  return new Promise((resolve, reject) => {
    parseString(ttmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      let vttContent = "WEBVTT\n\n";

      try {
        const body = result.tt.body[0];
        const div = body.div[0];
        const paragraphs = div.p || [];

        paragraphs.forEach((p, index) => {
          const begin = timeStampToVTT(p.$.begin);
          const end = timeStampToVTT(p.$.end);

          let text = "";

          // Extract text from various structures
          if (p._) {
            text = cleanText(p._);
          } else if (p.span) {
            text = extractTextFromSpan(p.span);
          } else if (p.$$) {
            // Handle mixed content
            text = p.$$.map((item) => {
              if (item["#name"] === "__text__") {
                return item._.trim();
              }
              if (item["#name"] === "span") {
                return extractTextFromSpan(item);
              }
              if (item["#name"] === "br") {
                return " ";
              }
              return "";
            })
              .join("")
              .replace(/\s+/g, " ")
              .trim();
          }

          // Clean up the text
          text = text
            .replace(/<br\s*\/?>/gi, " ") // Replace <br> tags with spaces
            .replace(/\s+/g, " ") // Replace multiple spaces with single space
            .trim();

          if (text) {
            vttContent += `${index + 1}\n`;
            vttContent += `${begin} --> ${end}\n`;
            vttContent += `${text}\n\n`;
          }
        });

        resolve(vttContent);
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function convertFile(inputFile, outputFile) {
  try {
    console.log(`🔄 Converting ${inputFile} to ${outputFile}`);

    const ttmlContent = fs.readFileSync(inputFile, "utf8");
    const vttContent = await convertTTMLToVTT(ttmlContent);

    fs.writeFileSync(outputFile, vttContent);
    console.log(`✅ Successfully converted to ${outputFile}`);

    return true;
  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🎬 Converting TTML subtitles to VTT format...\n");

  // Find all .ttml files in current directory
  const files = fs
    .readdirSync(".")
    .filter((file) => file.endsWith(".en.ttml"))
    .sort();

  if (files.length === 0) {
    console.log("❌ No TTML files found in current directory");
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} TTML files to convert`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const outputFile = file.replace(".en.ttml", ".vtt");
    const success = await convertFile(file, outputFile);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log("\n📊 Conversion Summary:");
  console.log(`  ✅ Successfully converted: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

// Check if xml2js is available
try {
  require("xml2js");
} catch (error) {
  console.error("❌ xml2js package not found. Installing...");
  const { execSync } = require("node:child_process");
  try {
    execSync("npm install xml2js", { stdio: "inherit" });
    console.log("✅ xml2js installed successfully");
  } catch (installError) {
    console.error(
      "❌ Failed to install xml2js. Please run: npm install xml2js",
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Conversion failed:", error);
  process.exit(1);
});
