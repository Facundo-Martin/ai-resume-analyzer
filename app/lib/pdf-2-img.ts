export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    // Set the worker source to use local file
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer created, size:", arrayBuffer.byteLength);

    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF document loaded, pages:", pdf.numPages);

    const page = await pdf.getPage(1);
    console.log("First page loaded");

    const viewport = page.getViewport({ scale: 4 });
    console.log("Viewport created:", viewport.width, "x", viewport.height);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas 2D context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log("Starting page render...");
    await page.render({ canvasContext: context, viewport }).promise;
    console.log("Page render complete");

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Blob created successfully, size:", blob.size);
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("Failed to create blob from canvas");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("PDF conversion error:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err instanceof Error ? err.message : err}`,
    };
  }
}
