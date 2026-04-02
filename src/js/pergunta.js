/**
 * Módulo para o formulário "Faça uma Pergunta" com suporte a anexo de PDF.
 * Exporta funções e constantes para permitir testes unitários.
 */

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const SUCCESS_MESSAGE_DURATION = 6000;

/**
 * Valida se o arquivo é um PDF válido e está dentro do limite de tamanho.
 * @param {File|{name:string,type:string,size:number}|null} file
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateFile(file) {
  if (!file) {
    return { valid: false, error: "Nenhum arquivo selecionado." };
  }

  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return {
      valid: false,
      error:
        'Tipo de arquivo não suportado: "' +
        file.name +
        '". Por favor, selecione um arquivo PDF.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error:
        "Arquivo muito grande: " +
        sizeMB +
        " MB. O tamanho máximo permitido é " +
        MAX_FILE_SIZE_MB +
        " MB.",
    };
  }

  return { valid: true, error: null };
}

/**
 * Inicializa o formulário de pergunta com suporte a upload de PDF e drag-and-drop.
 * Chamado após o DOM estar pronto.
 */
function initPerguntaForm() {
  const form = document.getElementById("form-pergunta");
  if (!form) return;

  const fileInput = document.getElementById("arquivo-pergunta");
  const dropZone = document.getElementById("drop-zone");
  const fileError = document.getElementById("file-error");
  const fileInfo = document.getElementById("file-info");
  const questionError = document.getElementById("question-error");
  const successMsg = document.getElementById("form-success");

  let selectedFile = null;

  function showFileError(msg) {
    fileError.textContent = msg;
    fileError.style.display = "block";
    fileInfo.style.display = "none";
    selectedFile = null;
  }

  function handleFile(file) {
    const result = validateFile(file);
    if (!result.valid) {
      showFileError(result.error);
      return;
    }
    fileError.style.display = "none";
    selectedFile = file;
    const kb = (file.size / 1024).toFixed(1);
    fileInfo.textContent =
      "Arquivo selecionado: " + file.name + " (" + kb + " KB)";
    fileInfo.style.display = "block";
  }

  fileInput.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      handleFile(this.files[0]);
    }
  });

  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });

  dropZone.addEventListener("click", function () {
    fileInput.click();
  });

  dropZone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const perguntaEl = document.getElementById("texto-pergunta");
    const pergunta = perguntaEl ? perguntaEl.value.trim() : "";

    if (!pergunta) {
      questionError.style.display = "block";
      return;
    }
    questionError.style.display = "none";

    const formData = new FormData();
    formData.append("pergunta", pergunta);
    if (selectedFile) {
      formData.append("arquivo", selectedFile);
    }

    successMsg.style.display = "block";
    form.reset();
    selectedFile = null;
    fileInfo.style.display = "none";
    fileError.style.display = "none";

    setTimeout(function () {
      successMsg.style.display = "none";
    }, SUCCESS_MESSAGE_DURATION);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { validateFile, MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES };
}

