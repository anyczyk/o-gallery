// export const searchString = (name) => {
//     const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:'\",.<>?/|\\`~";
//
//     let counter = 0;
//     let found = false;
//
//     function generateOfLength(targetLength, prefix = "") {
//         if (found) return;               // przerwij jeśli już znaleziono
//         if (prefix.length === targetLength) {
//             counter++;
//             console.log("proba " + counter + ": " + prefix);
//             if (prefix === name) {
//                 console.log("Znaleziono! 🎉");
//                 console.log("Liczba prób: " + counter);
//                 found = true;
//             }
//             return;
//         }
//
//         for (let i = 0; i < characters.length; i++) {
//             if (found) break;
//             generateOfLength(targetLength, prefix + characters[i]);
//         }
//     }
//
//     for (let len = 1; len <= 18; len++) {
//         if (found) break;
//         generateOfLength(len);
//     }
// };


// funkcja pomocnicza do SHA-256 → hex
async function sha256hex(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// główna funkcja brute-force z porównaniem hashy
export async function searchString(targetWord) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:'\",.<>?/|\\`~";

    const targetHash = await sha256hex(targetWord);   // hash słowa, które podajesz
    let counter = 0;
    let found = false;

    async function generateOfLength(targetLength, prefix = "") {
        if (found) return;

        if (prefix.length === targetLength) {
            counter++;

            console.log("próba " + counter + ": " + prefix);

            const hash = await sha256hex(prefix);

            if (hash === targetHash) {
                console.log("Znaleziono! 🎉");
                console.log("Słowo: " + prefix);
                console.log("Liczba prób: " + counter);
                found = true;
            }
            return;
        }

        for (let i = 0; i < characters.length; i++) {
            if (found) break;
            await generateOfLength(targetLength, prefix + characters[i]);
        }
    }

    // generacja długości 1–18
    for (let len = 1; len <= 18; len++) {
        if (found) break;
        await generateOfLength(len);
    }
}
