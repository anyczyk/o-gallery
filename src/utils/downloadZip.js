import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadZip(files, title) {
    console.log("Download zip:", files);

    const zip = new JSZip();

    for (const url of files) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split("/").pop();
            zip.file(filename, blob);
        } catch (err) {
            console.error("Error downloading:", url, err);
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `pictures-${title}.zip`);
}
