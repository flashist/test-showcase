const gulp = require('gulp');
const fs = require("fs");
const path = require("path");
const webpack = require('webpack-stream');
const ip = require('ip');
const prompts = require('prompts');
var fbuildscripts = require("@flashist/fbuildscripts");

// Importing all the build-scripts
var taskNames = Object.keys(fbuildscripts);
console.log("task names: ", taskNames);
var taskNamesCount = taskNames.length;
for (let taskNameIndex = 0; taskNameIndex < taskNamesCount; taskNameIndex++) {
    var tempTaskName = taskNames[taskNameIndex];
    gulp[tempTaskName] = tasks[tempTaskName];
}

// --------------------

gulp.task(
    'build',
    function () {
        return gulp.src('src/index.ts')
            .pipe(
                webpack(
                    {
                        config: require('./webpack.config.js')
                    }
                )
            )
            .pipe(gulp.dest('dist/'));
    }
);

gulp.task(
    "ip",
    function (cb) {
        console.log(" ");
        console.log("====================");
        console.log("My IP address is: " + ip.address());
        console.log("====================");
        console.log(" ");
        cb();
    }
);

gulp.task(
    "generate-load-config-for-folder",
    async (cb) => {
        // fs.readdirSync(directoryPath);
        console.log("TASK: generate-load-config-for-folder");

        const folderPath = await chooseFolder("./");
        console.log("folderPath: ", folderPath);

        const fileGroupsResponse = await prompts({
            type: 'text',
            name: 'value',
            message: 'Input file groups for loading files (separate with comma if multiple or leave empty if none)'
        });

        let fileGroupsList = [];
        console.log("fileGroupsResponse: ", fileGroupsResponse)
        if (fileGroupsResponse && fileGroupsResponse.value) {
            fileGroupsList = fileGroupsResponse.value.split(",");
        }

        const fileExtensionsToFileTypeMap = {
            ["png"]: "image",
            ["jpg"]: "image",
            ["jpeg"]: "image",
            ["json"]: "text"
        };

        const fileLoadConfigs = fs.readdirSync(folderPath, { withFileTypes: true })
            .map(
                (item) => {
                    // console.log("item: ", JSON.stringify(item));
                    // console.log("item.name: ", item.name);
                    // console.log("basename: ", path.basename(item.name));
                    // console.log("extension: ", path.extname(item.name));

                    let tempExtension = path.extname(item.name).toLowerCase();
                    if (tempExtension.charAt(0) === ".") {
                        tempExtension = tempExtension.split(".")[1];
                    }
                    let tempFileType = fileExtensionsToFileTypeMap[tempExtension];
                    if (!tempFileType) {
                        tempFileType = "default";
                    }

                    return {
                        "id": path.basename(item.name, path.extname(item.name)),
                        "src": path.join(folderPath, item.name),
                        "fileType": tempFileType,
                        "loadGroups": fileGroupsList
                    }
                }
            );
        console.log("fileLoadConfigs: ", JSON.stringify(fileLoadConfigs, null, 2));


        cb();
    }
);

const chooseFolder = async (parentFolderPath) => {
    const listOfFolderNames = fs.readdirSync(parentFolderPath, { withFileTypes: true })
        .filter((element) => { return element.isDirectory() })
        .map((element) => { return { title: element.name } });
    // Add empty selection, to choose the current folder, without subfolders
    const curFolderTitleName = "==CURRENT FOLDER==";
    listOfFolderNames.unshift({ title: curFolderTitleName })

    const targetFolderResponse = await prompts({
        type: 'autocomplete',
        name: 'value',
        message: 'Choose folder to generate config for',
        choices: listOfFolderNames,
        suggest: suggestByAutocompleteScore
    });

    let result = parentFolderPath;
    // If subfolder was chosen to the same choosing for the subfolder
    if (targetFolderResponse.value && targetFolderResponse.value !== curFolderTitleName) {
        const chosenFolderPath = path.join(parentFolderPath, targetFolderResponse.value);
        const hasSubfolders = checkIfHasSubFolders(chosenFolderPath);
        if (hasSubfolders) {
            result = await chooseFolder(chosenFolderPath);
        } else {
            result = chosenFolderPath;
        }
    }

    return result;
}

const checkIfHasSubFolders = (path) => {
    const listOfFolders = fs.readdirSync(path, { withFileTypes: true })
        .filter((element) => { return element.isDirectory() })

    let result = false;
    if (listOfFolders.length > 0) {
        result = true;
    }

    return result;
}

const suggestByAutocompleteScore = async (input, choices) => {

    let result = choices.concat();
    // console.log("result: ", result);
    if (input) {
        let atLeastOneFullInputMatch = false;

        const choicesCount = result.length;
        for (let choiceIndex = 0; choiceIndex < choicesCount; choiceIndex++) {
            const tempChoice = result[choiceIndex];
            tempChoice.autocompleteScore = 0;

            tempChoice.isFullInputMatch = false;
            const fullInputIndex = tempChoice.title.indexOf(input);
            if (fullInputIndex !== -1) {
                tempChoice.autocompleteScore = Number.MAX_SAFE_INTEGER;
                tempChoice.autocompleteScore -= fullInputIndex;
                tempChoice.isFullInputMatch = true;

                atLeastOneFullInputMatch = true;

            } else {
                const inputLettersCount = input.length;
                for (let inputLetterIndex = 0; inputLetterIndex < inputLettersCount; inputLetterIndex++) {
                    const tempLetter = input.charAt(inputLetterIndex);
                    if (tempChoice.title.indexOf(tempLetter) !== -1) {
                        tempChoice.autocompleteScore++;
                    }
                }
            }
        }

        if (atLeastOneFullInputMatch) {
            result = result.filter(
                (item) => {
                    return item.isFullInputMatch;
                }
            )
        }

        result = result.filter((item) => item.autocompleteScore > 0);
        result.sort((item1, item2) => item2.autocompleteScore - item1.autocompleteScore);
    }

    return result;
}

// INTERACTIVE PROMPTS

gulp.task(
    'rename-symbols',
    function (cb) {
        const folderPath = "assets/sources/images/symbols_new/";
        const allFileNames = fs.readdirSync(folderPath)

        const oldFileNamePrefix = "Symbol_";
        allFileNames.forEach(
            (newFileName) => {
                const oldFileName = oldFileNamePrefix + newFileName;

                if (allFileNames.indexOf(oldFileName) !== -1) {

                    const oldFileNamePath = folderPath + oldFileName;
                    const newFileNamePath = folderPath + newFileName;

                    // 1. Remove old file
                    fs.unlinkSync(oldFileNamePath);
                    // 2. Rename new file
                    fs.renameSync(newFileNamePath, oldFileNamePath);
                }
            }
        );

        cb();
    }
);


//
var imagemagick = require('imagemagick');
gulp.task(
    'resize-symbols',
    function (cb) {
        const folderPath = "assets/sources/images/symbols/";
        const allFileNames = fs.readdirSync(folderPath)

        imagemagick.resize({
            srcPath: './assets/sources/images/symbols/Symbol_Amethyst.png',
            dstPath: './assets/sources/images/symbols/Symbol_Amethyst_resized.png',
            width: 256
        }, function (err, stdout, stderr) {
            if (err) throw err;
            console.log('resized kittens.jpg to fit within 256x256px');
        });

        // const partToRemove = " Background Removed";
        // allFileNames.forEach(
        //     (oldFileName) => {

        //         if (oldFileName.indexOf(".png") === -1) {
        //             const oldFileNamePath = folderPath + oldFileName;

        //             const newFileName = oldFileName + ".png";
        //             const newFileNamePath = folderPath + newFileName;

        //             fs.renameSync(oldFileNamePath, newFileNamePath);
        //         }
        //     }
        // );

        cb();
    }
);
