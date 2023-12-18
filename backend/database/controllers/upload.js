const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const join = path.join
const router = express.Router();
const { STATICPATH } = require("../../staticPathProvider");

const upload = ({ diskStorage, limits, fileFilter }) =>
    multer({
        storage: multer.diskStorage(diskStorage),
        //文件大小限制设置
        limits: limits ?? null,
        //过滤文件设置
        fileFilter: fileFilter ?? null,
    });
;

const Img = {
    destination: (req, _file, callback) => {
        let { dirname } = req.params;
        dirname = decodeURIComponent(dirname)
        console.log(dirname);
        const imagesDir = join(STATICPATH, dirname);
        if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
        callback(null, imagesDir);
    },
    filename: (_req, file, callback) => {
        callback(null, `${Date.now()}--${file.originalname}`);
    },
};

const checkImagesUpload = upload({
    diskStorage: Img,
    //文件大小设置
    limits: {
        files: 4, // 最多允许发送20个文件,
        fileSize: 300 * 1024 * 1024, //300mb限制
    },
    //过滤文件设置
    fileFilter: (__req, file, cb) => {
        console.log(file);
        // 只允许发送图像文件
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(
                new multer.MulterError("LIMIT_UNEXPECTED_FILE", "只接收图片文件!!!"),
                false,
            );
        }
        cb(null, true);
    },
}).array("images");

router.post('/:dirname', async (req, res) => {
    checkImagesUpload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_COUNT") {
                return res.status(400).send({ msg: "上传图片超过数量,最多只允许接收4张图片!" });
            } else if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).send({ msg: `图片集大小不能超过50mb!` });
            } else {
                return res.status(400).send({ msg: `上传图片时发生错误! ${err.field}` });
            }
        } else if (err) {
            return res.status(400).send({ msg: `上传图片时发生其他错误! ${err}` });
        }

        if (req.files === undefined || req.files.length <= 0) {
            return res.status(400).send({ msg: "不能上传空内容,请检查后重试!" });
        }


        return res.status(200).send({ msg: "上传图片成功" });
    });
});

router.get('/:dirname', async (req, res) => {
    try {
        let { dirname } = req.params;
        dirname = decodeURIComponent(dirname)
        console.log(dirname);
        const imagesDir = join(STATICPATH, dirname);

        const files = fs.readdirSync(imagesDir);
        const images = files
            .map(file => ({
                name: file,
                url: `static/${dirname}/${file}`
            }));

        res.send({ data: images, msg: "获取目录图片成功" });
    } catch (error) {
        res.status(400).send({ msg: `获取目录图片失败:${error}` });
    }
});

router.get('/', async (req, res) => {
    try {
        const imagesDir = STATICPATH;
        const files = fs.readdirSync(imagesDir);

        const images = files
            .map(file => {
                if (file.split('.').length < 2) {
                    return file;
                }
            })
            .filter(image => image !== undefined);

        res.send({ data: images, msg: "获取目录成功" });
    } catch (error) {
        res.status(400).send({ msg: `获取目录失败:${error}` });
    }
});

module.exports = router;