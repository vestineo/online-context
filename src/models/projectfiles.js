import fs from "fs";
import path from "path";
// import {dbo} from "../db/conn.js";
import appRoot from 'app-root-path'
import { MongoClient } from "mongodb";
const client = new MongoClient("mongodb://localhost:27017");
client.connect();
let db = client.db("onlineContext");

// let db = dbo.getDb();
let projects = db.collection("projects");

const data = "\\starttext\nHello Context\n\\stoptext";
const projectsFolder = path.join(appRoot.toString(), "projects");

const saveFile = (file) => {
  projects.updateOne(
    { name: file.project },
    {
      $push: { files: file },
    },
    (err, result) => {
      if (err) console.log(err);
      return result;
    }
  );
};

export class Projectfiles {
  constructor(project, name, type, folder) {
    this.project = project;
    this.name = name || "main.tex";
    this.type = type || "text";
    this.folder = folder || "";
    switch (type) {
      case "text":
        this.#createTextFile();
        break;
      case "folder":
        this.#createFolder();
        break;
      case "binary":
        this.#createBinaryFile();
      default:
        this.#createTextFile();
    }
    saveFile({
      project: this.project,
      name: this.name,
      type: this.type,
      folder: this.folder,
    });
  }

  get #folderpath() {
    return path.join(projectsFolder, `${this.project}`, `${this.folder}`);
  }
  get #filepath() {
    return path.join(this.#folderpath, this.name);
  }

  #createTextFile() {
    if (
      fs.existsSync(this.#folderpath, (err) => {
        if (err) console.log(err);
      })
    ) {
      console.log("folder exist");
    } else {
      fs.mkdir(this.#folderpath, (err) => {
        if (err) console.log(err);
      });
    }

    if (
      fs.existsSync(this.#filepath, (err) => {
        if (err) console.log(err);
      })
    ) {
      console.log("file exist");
    } else {
      fs.writeFile(this.#filepath, data, (err) => {
        if (err) console.log(err);
      });
    }
  }
  #createFolder() {
    if (
      fs.existsSync(this.#folderpath, (err) => {
        if (err) console.log(err);
      })
    ) {
      console.log("folder exist");
    } else {
      fs.mkdir(this.#folderpath, (err) => {
        if (err) console.log(err);
      });
    }
  }
  #createBinaryFile() {
    this.#createTextFile();
  }
}

export const updateFile = (data = "") => {
  const filepath = path.join(
    projectsFolder,
    file.project,
    file.folder,
    newName
  );
  fs.writeFile(filepath, data, (err) => {
    if (err) console.log(err);
  });
};

export const deleteFile = (file) => {
  const filepath = path.join(
    projectsFolder,
    `${file.project}`,
    file.folder,
    file.name
  );
  fs.unlink(filepath, (err) => {
    if (err) console.log(err);
  });
  projects.updateOne(
    { name: file.project, "files.name": file.name },
    { $pull: { files: { name: file.name } } }
  );
};

export const renameFile = (file, newName) => {
  const newPath = path.join(projectsFolder, `${file.project}`, file.folder, newName);
  const oldPath = path.join(
    projectsFolder,
    `${file.project}`,
    file.folder,
    file.name
  );
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully renamed the file");
    }
  });

  projects.updateOne(
    { name: file.project, "files.name": file.name },
    { $set: { "files.$.name": newName } }
  );
};
