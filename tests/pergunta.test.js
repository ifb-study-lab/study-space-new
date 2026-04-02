const {
  validateFile,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
} = require("../src/js/pergunta");

describe("validateFile", () => {
  test("retorna erro quando nenhum arquivo é fornecido (null)", () => {
    const result = validateFile(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test("retorna erro quando undefined é fornecido", () => {
    const result = validateFile(undefined);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test("aceita um arquivo PDF válido pelo MIME type", () => {
    const file = {
      name: "meu-documento.pdf",
      type: "application/pdf",
      size: 1024 * 512,
    };
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test("aceita um arquivo PDF identificado apenas pela extensão quando MIME type é genérico", () => {
    const file = {
      name: "documento.pdf",
      type: "application/octet-stream",
      size: 1024,
    };
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test("rejeita arquivo Word (.docx)", () => {
    const file = {
      name: "relatorio.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 1024,
    };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("não suportado");
  });

  test("rejeita arquivo de imagem (.png)", () => {
    const file = { name: "foto.png", type: "image/png", size: 1024 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("não suportado");
  });

  test("rejeita arquivo de texto (.txt)", () => {
    const file = { name: "notas.txt", type: "text/plain", size: 500 };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("não suportado");
  });

  test("rejeita PDF que excede o limite de tamanho", () => {
    const file = {
      name: "enorme.pdf",
      type: "application/pdf",
      size: MAX_FILE_SIZE_BYTES + 1,
    };
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("muito grande");
    expect(result.error).toContain(String(MAX_FILE_SIZE_MB));
  });

  test("aceita PDF exatamente no limite de tamanho", () => {
    const file = {
      name: "exato.pdf",
      type: "application/pdf",
      size: MAX_FILE_SIZE_BYTES,
    };
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  test("a constante MAX_FILE_SIZE_MB é 10", () => {
    expect(MAX_FILE_SIZE_MB).toBe(10);
  });

  test("a constante MAX_FILE_SIZE_BYTES corresponde a 10 MB", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
  });
});
