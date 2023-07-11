exports.getFileType = (base64Encoded) => {
  return base64Encoded.match(/[^:/]\w+(?=;|,)/)[0];
};

exports.formatTextDetectionFromDocumentApiRes = (json) => {
  let data = json.responses[0]?.fullTextAnnotation;
  let pages = data?.pages;
  let parsedText = data?.text;

  let newArr = pages.map((data) => {
    let height = data?.height;
    let width = data?.width;
    let blocks = data?.blocks;
    let newWordsArr = [];
    blocks.forEach((block) => {
      let paragraphs = block?.paragraphs;
      paragraphs.forEach((para) => {
        let words = para?.words;
        words.map((word) => {
          let normalizedVertices = word?.boundingBox?.normalizedVertices;
          let symbols = word?.symbols;

          let wordString = "";
          symbols.map((symbol) => {
            wordString += symbol?.text;
          });

          newWordsArr.push({ normalizedVertices, word: wordString });
          return null;
        });

        return null;
      });

      return null;
    });

    return { height, width, words: newWordsArr };
  });

  return { text: parsedText, pages: newArr };
};
