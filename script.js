import {
  EditorState,
  EditorView,
  basicSetup
} from "@codemirror/basic-setup"
import {
  ViewPlugin
} from '@codemirror/view'

import {
  Text
} from '@codemirror/state'

import { context } from './context.js'

// Global Const 
const compileBtn = document.getElementById("compileBtn");
compileBtn.addEventListener('click', requestPdf);
const texFile = "./hello.tex";
const url = "../../hello.pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "./pdfjs/build/pdf.worker.js";

// Send changes
async function postDoc(url = '', doc = '') {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `editor=${encodeURI(doc)}`,
  });
  return response;
}

// Extensions

const requestCompile = ViewPlugin.fromClass(class {
  savedoc = () => {
    postDoc('http://localhost:3000', editor.state.doc).then(data => {
      // requestPdf()
    })
  }

  autoto = setTimeout(this.savedoc, 3000);
  constructor(view) {}
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      if (this.autoto !== undefined) {
        clearTimeout(this.autoto)
        this.autoto = setTimeout(this.savedoc, 3000)
      }
    }
  }
}, {})

const fixedHeightEditor = EditorView.theme({
  "&": {height: "850px"},
  ".cm-scroller": {overflow: "auto"}
})

const minHeightEditor = EditorView.theme({
  ".cm-content, .cm-gutter": {minHeight: "200px"}
})

let baseTheme = EditorView.baseTheme({
  ".cm-o-replacement": {
    display: "inline-block",
    width: ".5em",
    height: ".5em",
    borderRadius: ".25em"
  },
  "&light .cm-o-replacement": {
    backgroundColor: "#04c"
  },
  "&dark .cm-o-replacement": {
    backgroundColor: "#5bf"
  }
})

let editor = new EditorView({
  state: EditorState.create({
    extensions: [
			basicSetup, 
			requestCompile.extension,
			baseTheme,
			fixedHeightEditor,
	    context()
			// minHeightEditor,
		]
  }),
  parent: document.getElementById('editor')
})

// viewer related

function requestPdf() {
  setTimeout(() => {
    renderPdf(url);
  }, 2500);
}

function renderPdf(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then((pdf) => {
    pdf.getPage(1).then((page) => {
      const canvas = document.getElementById("the-canvas");
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({
        scale: 1
      });
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      };
      page.render(renderContext);
    });
  });
}

function fetchText(url) {
  return fetch(url)
    .then((response) => response.body)
    .then((body) => body.getReader().read())
    .then(
      (read) => {
        let chunk = read.value;
        let readerDone = read.done;
        const utf8Decoder = new TextDecoder("utf-8");
        chunk = chunk ? utf8Decoder.decode(chunk) : "";
        return chunk;
      })
}

// Init

fetchText(texFile).then((chunk) => {
  editor.dispatch({
    changes: {
      from: 0,
      insert: chunk
    }
  })
});
renderPdf(url);
