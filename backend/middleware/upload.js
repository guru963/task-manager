
import multer from 'multer';

const storage = multer.memoryStorage(); // Or configure diskStorage if needed

const upload = multer({ storage });

export default upload;
