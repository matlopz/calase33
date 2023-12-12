const multer = require('multer');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = determineFileType(file);
    cb(null, `${process.cwd()}/src/public/img/image/${fileType}`);

    
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'productThumbnails') { 
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
});

function determineFileType(file) {
  const fileTypes = {
    'image/jpg': 'images',
    'image/png': 'images',
    'application/pdf': 'documents',
    // Agrega más tipos según tus necesidades
    default: 'other',
  };

  return fileTypes[file.mimetype] || fileTypes.default;
}

module.exports = uploader;
