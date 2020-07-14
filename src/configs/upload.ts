import multer from 'multer';
import path from 'path';

const upload = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'tmp'),
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

export default upload;
