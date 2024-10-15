const fs = require("fs")
const path = require("path")

// Function to get the folder structure and exclude certain directories
function getFolderStructure(
  dir,
  level = 0,
  exclude = [".git", "node_modules"]
) {
  let structure = ""
  const indent = "  ".repeat(level) // indentation for nested files/folders

  const items = fs.readdirSync(dir, { withFileTypes: true })

  items.forEach((item) => {
    // Skip excluded directories
    if (exclude.includes(item.name)) {
      return
    }

    if (item.isDirectory()) {
      structure += `${indent}|-- ${item.name}/\n` // folder
      structure += getFolderStructure(
        path.join(dir, item.name),
        level + 1,
        exclude
      ) // recursive call for subfolders
    } else {
      structure += `${indent}|-- ${item.name}\n` // file
    }
  })

  return structure
}

// Function to write the folder structure to a file
function writeFolderStructureToFile(directory, outputFile) {
  const folderStructure = getFolderStructure(directory)
  fs.writeFileSync(outputFile, folderStructure, "utf8")
  console.log(`Folder structure written to: ${outputFile}`)
}

// Specify the existing folder and the output file
const existingFolder = path.join(__dirname) // Replace with your folder name
const outputFile = path.join(__dirname, "folder-structure.txt")

// Write the folder structure to a file excluding .git and node_modules
writeFolderStructureToFile(existingFolder, outputFile)
