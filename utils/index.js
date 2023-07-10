exports.getFileType = (base64Encoded) => {
  return base64Encoded.match(/[^:/]\w+(?=;|,)/)[0];
};
