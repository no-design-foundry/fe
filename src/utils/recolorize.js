function getTableOffset(fontData, tag) {
    const numTables = new DataView(fontData.buffer).getUint16(4, false);
    for (let i = 0; i < numTables; i++) {
        const offset = 12 + i * 16;
        const tableTag = String.fromCharCode(...fontData.slice(offset, offset + 4));
        const tableOffset = new DataView(fontData.buffer).getUint32(offset + 8, false);
        if (tableTag === tag) {
            return tableOffset;
        }
    }
    throw new Error(`Table ${tag} not found in font data.`);
}

function updatePaletteColors(fontData, cpalOffset, newColors) {
    const colorRecordsOffset = cpalOffset + 12 + 2
    for (let i = 0; i < newColors.length; i++) {
        const colorOffset = colorRecordsOffset + i * 4;
        fontData[colorOffset + 0] = newColors[i][2];
        fontData[colorOffset + 1] = newColors[i][1];
        fontData[colorOffset + 2] = newColors[i][0];
        fontData[colorOffset + 3] = newColors[i][3];
    }
}

// Save modified font data


export default function (fontData, colors) {
    const workingFontData = fontData.slice()
    try {
        const cpalOffset = getTableOffset(workingFontData, "CPAL");
        updatePaletteColors(workingFontData, cpalOffset, colors);
        return workingFontData

    } catch (error) {
        console.error("Error processing font data:", error);
    }
}