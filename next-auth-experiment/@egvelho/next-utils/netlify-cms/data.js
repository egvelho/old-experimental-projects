"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.removeFilesFromFolder = exports.writeChunks = exports.chunkItems = exports.writeItems = exports.cleanFolder = exports.getItems = exports.sortByDate = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const slug_1 = tslib_1.__importDefault(require("slug"));
function sortByDate(getDate) {
    return (left, right) => {
        return getDate(left) - getDate(right);
    };
}
exports.sortByDate = sortByDate;
function getItems(inputFolder) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileNames = fs_1.default.readdirSync(inputFolder);
        return fileNames.map((fileName, index) => ({
            id: index,
            slug: slug_1.default(fileName.split(".").slice(0, -1).join(".")),
            data: JSON.parse(fs_1.default.readFileSync(path_1.default.join(inputFolder, fileName)).toString()),
        }));
    });
}
exports.getItems = getItems;
function cleanFolder(outputFolder, removeFiles) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (removeFiles) {
            if (!fs_1.default.existsSync(outputFolder)) {
                fs_1.default.mkdirSync(outputFolder);
            }
            else {
                fs_1.default.readdirSync(outputFolder).forEach((file) => fs_1.default.unlinkSync(`${outputFolder}/${file}`));
            }
        }
    });
}
exports.cleanFolder = cleanFolder;
function writeItems(outputFolder, dataArray) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        dataArray.forEach(({ slug, data }) => fs_1.default.writeFileSync(`${path_1.default.join(outputFolder, slug)}.json`, JSON.stringify(data)));
    });
}
exports.writeItems = writeItems;
function chunkItems(dataArray, pagination) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let chunkedData = [[]];
        for (const data of dataArray) {
            if (chunkedData[chunkedData.length - 1].length < pagination) {
                chunkedData[chunkedData.length - 1].push(data);
            }
            else {
                chunkedData.push([data]);
            }
        }
        return chunkedData;
    });
}
exports.chunkItems = chunkItems;
function writeChunks(outputFolder, dataChunks) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        dataChunks.forEach((dataChunk, page) => fs_1.default.writeFileSync(`${outputFolder}/${page}.json`, JSON.stringify(dataChunk)));
    });
}
exports.writeChunks = writeChunks;
function removeFilesFromFolder(folder) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(folder)) {
            fs_1.default.mkdirSync(folder);
        }
        else {
            fs_1.default.readdirSync(folder).forEach((file) => fs_1.default.unlinkSync(`${folder}/${file}`));
        }
    });
}
exports.removeFilesFromFolder = removeFilesFromFolder;
function groupBy(dataArray, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let dataGroup = {};
        for (const item of dataArray) {
            if (dataGroup[key] === undefined) {
                dataGroup[key] = [];
            }
            dataGroup[key].push(item);
        }
    });
}
exports.groupBy = groupBy;
//# sourceMappingURL=data.js.map