export async function verifyPassword(inputPassword, storedHash) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputPassword);

    // oblicz SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // zamień na hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // porównaj z zapisanym hashem
    return hashHex === storedHash;
}
