const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const join = path.join
const router = express.Router();
const { STATICPATH } = require("../../staticPathProvider");
const { DateTime } = require("luxon");

const upload = ({ diskStorage, limits, fileFilter }) =>
    multer({
        storage: multer.diskStorage(diskStorage),
        //文件大小限制设置
        limits: limits ?? null,
        //过滤文件设置
        fileFilter: fileFilter ?? null,
    });
;

function getBeijingTimestamp() {
    // 获取当前时间的 DateTime 对象
    const now = DateTime.now().setZone("Asia/Shanghai");

    // 获取调整后的北京时间的时间戳
    const beijingTimestamp = now.toMillis();

    return beijingTimestamp;
}

const Img = {
    destination: (req, _file, callback) => {
        let { pname, dirname } = req.params;
        const pdirDir = join(STATICPATH, pname);
        const imagesDir = join(STATICPATH, pname, dirname);
        if (!fs.existsSync(pdirDir)) fs.mkdirSync(pdirDir);
        if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
        callback(null, imagesDir);
    },
    filename: (_req, file, callback) => {

        callback(null, `${getBeijingTimestamp()}--${file.originalname}`);
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

const createSuccessResponse = (data, msg, code = 200) => {
    return { success: true, data, msg, code };
};

const createErrorResponse = (msg, code = 400) => {
    return { success: false, msg, code };
};

router.post('/:pname/:dirname', async (req, res) => {
    try {
        checkImagesUpload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_COUNT") {
                    return res.status(400).json(createErrorResponse("上传图片超过数量,最多只允许接收4张图片!"));
                } else if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json(createErrorResponse(`图片集大小不能超过50mb!`));
                } else {
                    return res.status(400).json(createErrorResponse(`上传图片时发生错误! ${err.field}`));
                }
            } else if (err) {
                return res.status(400).json(createErrorResponse(`上传图片时发生其他错误! ${err}`));
            }

            if (req.files === undefined || req.files.length <= 0) {
                return res.status(400).json(createErrorResponse("不能上传空内容,请检查后重试!"));
            }

            return res.status(200).json(createSuccessResponse(null, "上传图片成功"));
        });
    } catch (error) {
        res.status(500).json(createErrorResponse(`上传图片时发生未知错误: ${error.message}`, 500));
    }
});

router.get('/:pname/:dirname', async (req, res) => {
    try {
        const commonImageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
        const { dirname, pname } = req.params;
        const imagesDir = join(STATICPATH, pname, dirname);

        const files = fs.readdirSync(imagesDir);
        const images = files
            .filter(file => {
                const extension = path.extname(file).toLowerCase();
                return commonImageFormats.includes(extension);
            })
            .map(file => ({
                name: file.split('.')[0].split('--')[1],
                fullName: file,
                createdAt: file.split('--')[0],
                url: `static/${pname}/${dirname}/${file}`
            }))
            .sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));

        res.status(200).json(createSuccessResponse(images, "获取目录图片成功"));
    } catch (error) {
        res.status(500).json(createErrorResponse(`获取目录图片失败: ${error.message}`, 500));
    }
});

router.get('/:pname', async (req, res) => {
    try {
        const { pname } = req.params;
        const imagesDir = join(STATICPATH, pname);
        const files = fs.readdirSync(imagesDir);

        const images = files
            .map(file => {
                if (file.split('.').length < 2) {
                    return file;
                }
            })
            .filter(image => image !== undefined);

        res.status(200).json(createSuccessResponse(images, "获取目录成功"));
    } catch (error) {
        res.status(500).json(createErrorResponse(`获取目录失败: ${error.message}`, 500));
    }
});

router.put('/:pname/:dirname/:filename', async (req, res) => {
    try {
        const { pname, dirname, filename } = req.params;
        const imagePath = join(STATICPATH, pname, dirname, filename);
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).json(createErrorResponse("新文件名不能为空"));
        }

        const newImagePath = join(STATICPATH, pname, dirname, `${newName}.${filename.split('.')[1]}`);

        if (fs.existsSync(imagePath)) {
            fs.renameSync(imagePath, newImagePath);
            res.status(200).json(createSuccessResponse(null, "修改图片文件名成功"));
        } else {
            res.status(404).json(createErrorResponse("图片不存在", 404));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse(`修改图片文件名失败: ${error.message}`, 500));
    }
});

router.put('/:pname/:dirname', async (req, res) => {
    try {
        const { pname, dirname } = req.params;
        const { newDirName } = req.body;

        if (!newDirName) {
            return res.status(400).json(createErrorResponse("新文件夹名不能为空"));
        }

        const oldFolderPath = join(STATICPATH, pname, dirname);
        const newFolderPath = join(STATICPATH, pname, newDirName);

        if (fs.existsSync(oldFolderPath)) {
            fs.renameSync(oldFolderPath, newFolderPath);
            res.status(200).json(createSuccessResponse(null, "修改文件夹名成功"));
        } else {
            res.status(404).json(createErrorResponse("文件夹不存在", 404));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse(`修改文件夹名失败: ${error.message}`, 500));
    }
});

router.delete('/:pname/:dirname/:filename', async (req, res) => {
    try {
        const { pname, dirname, filename } = req.params;
        const imagePath = join(STATICPATH, pname, dirname, filename);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            res.status(200).json(createSuccessResponse(null, "删除图片成功"));
        } else {
            res.status(404).json(createErrorResponse("图片不存在", 404));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse(`删除图片失败: ${error.message}`, 500));
    }
});

router.delete('/:pname/:dirname', async (req, res) => {
    try {
        const { pname, dirname } = req.params;
        const folderPath = join(STATICPATH, pname, dirname);

        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath, { recursive: true });
            res.status(200).json(createSuccessResponse(null, "删除文件夹及图片成功"));
        } else {
            res.status(404).json(createErrorResponse("文件夹不存在", 404));
        }
    } catch (error) {
        res.status(500).json(createErrorResponse(`删除文件夹及图片失败: ${error.message}`, 500));
    }
});


module.exports = router;