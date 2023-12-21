const multer = require('multer');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    const fileType = determineFileType(files);
    cb(null, `${process.cwd()}/src/public/img/image/${fileType}`);

    
  },
  filename: (req, files, cb) => {
    cb(null, files.originalname);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, files, cb) => {
    if (files.fieldname === 'productThumbnails') { 
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
});

function determineFileType(files) {
  const fileTypes = {
    'image/jpg': 'images',
    'image/png': 'images',
    'application/pdf': 'documents',
    // Agrega más tipos según tus necesidades
    default: 'other',
  };
  

  return fileTypes[files.mimetype] || fileTypes.default;
}

module.exports = uploader;
