const multer = require('multer');
const path = require('path');
const crypto = require('crypto');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/photo'));
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename =
            `${req?.user?.uid}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single("profilePicture");     