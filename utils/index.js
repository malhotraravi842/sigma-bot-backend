exports.getFileType = (base64Encoded) => {
  return base64Encoded.match(/[^:/]\w+(?=;|,)/)[0];
};

exports.formatTextDetectionFromDocumentApiRes = (json) => {
  let pagesData = [];

  json.responses.forEach((res, pageNum) => {
    let data = res.fullTextAnnotation;
    let pages = data.pages;
    let parsedText = data.text;

    let newWordsArr = [];
    pages.forEach((data) => {
      let blocks = data.blocks;
      blocks.forEach((block) => {
        let paragraphs = block.paragraphs;
        paragraphs.forEach((para) => {
          let words = para.words;
          words.forEach((word) => {
            let normalizedVertices = word.boundingBox.normalizedVertices;
            let symbols = word.symbols;

            let wordString = "";
            symbols.forEach((symbol) => {
              wordString += symbol.text;
            });

            newWordsArr.push({ normalizedVertices, word: wordString });
          });
        });
      });
    });

    pagesData.push({
      text: parsedText,
      pageNumber: pageNum + 1,
      words: newWordsArr,
    });
  });

  return pagesData;
};
