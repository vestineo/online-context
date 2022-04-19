const fs = require("fs");
const path = require("path");
const appRoot = require('app-root-path')
const { Projectfiles } = require("./projectfiles.js");
const {dbo} = require('../db/conn.js')
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
client.connect();
let db = client.db("onlineContext");
let projects = db.collection("projects");

const projectsFolder = path.join(appRoot.toString(), "projects");

 class Project {
  constructor(name, author) {
    this.name = name || "New Project";
    this.author = author || "ghost";

    projects.insertOne(
      {
        name: this.name,
        author: [this.author],
        files: [],
      },
      (err, result) => {
        if (err) console.log(err);
        const main = new Projectfiles(this.name);
        return result;
      }
    );
    let folderpath = path.join(projectsFolder, `${this.name}`);
    if (
      fs.existsSync(folderpath, (err) => {
        if (err) console.log(err);
      })
    ) {
      console.log("folder exist");
    } else {
      fs.mkdir(folderpath, (err) => {
        if (err) console.log(err);
      });
    }
  }
}

 const deleteProject = (projName, projAuthor) => {
  const folderpath = path.join(projectsFolder, `${projName}`);
  fs.rm(folderpath, { recursive: true }, (err) => {
    if (err) console.log(err);
  });
  projects.deleteOne({ name: projName, author: projAuthor });
};

 const renameProject = (projName, projAuthor, newName) => {
  const newPath = path.join(projectsFolder, `${newName}`);
  const oldPath = path.join(projectsFolder, `${projName}`);
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully renamed the file");
    }
  });

  projects.updateOne(
    { name: projName, author: projAuthor },
    { $set: { name: newName , "files.$[].project": newName} }
  );
};

module.exports = {
	Project: Project,
	deleteProject: deleteProject,
	renameProject: renameProject
}
