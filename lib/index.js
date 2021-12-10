"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.serve = exports.initCLI = exports.Page = exports.html = exports.useRouter = exports.stop = exports.start = void 0;
const express_1 = require("express");
const path = require("path");
const glob_1 = require("glob");
const holder = {
    context: null,
    took: false,
};
const start = (req, ...params) => {
    if (holder.context !== null) {
        console.log("context is acutly", holder.context);
        throw new Error("Context leak");
    }
    const [context] = params;
    holder.context = context;
    holder.took = false;
    return true;
};
exports.start = start;
const take = () => {
    const {context} = holder;
    holder.context = null;
    holder.took = true;
    return context;
};
const stop = (req) => {
    if (holder.took && holder.context !== null) {
        throw new Error("Context leak");
    }
    return true;
};
exports.stop = stop;
const useRouter = (routes) => {
    return {
        root: () => {
            const context = take();
            console.log("context", context);
            return routes["/"]();
        }
    };
};
exports.useRouter = useRouter;
const html = (strings) => {
    return `<!DOCTYPE html>${strings.join("")}`;
};
exports.html = html;

class Page {
    render() {
        return (0, exports.html)`
            <head>
                <title>Aron</title>
            </head>
            <body>
            <h1>This is a default page. Overwrite 'render' function to render page content.</h1>
            </body>
        `;
    }
}

exports.Page = Page;
let app;
const initCLI = (cwd, options) => __awaiter(void 0, void 0, void 0, function* () {
    app = (0, express_1.default)();
    const indexPath = path.join(cwd, options.index);
    console.log(indexPath, path.dirname(indexPath));
    const Index = yield Promise.resolve().then(() => require(indexPath));
    const globOptions = {
        cwd: path.dirname(indexPath),
        nodir: true,
        nosort: true,
        ignore: null,
    };
    if (options.ignore) {
        globOptions.ignore = options.ignore;
    }
    console.log("options", globOptions);
    const pages = glob_1.default.sync("**/*.js", globOptions);
    console.log(pages);
    for (let i = 0; i < pages.length; i++) {
    }
});
exports.initCLI = initCLI;
const serve = (routes) => {
    app.get("*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.path, req.method);
        /*
                try {
                    start(req, {props: {lol: "OMG", ts: (new Date()).getTime()}})
                    const result = Index.default()
                    if (typeof result === "object" && result.hasOwnProperty("then")) {
                        console.log("awaiting promise")
                        await result
                    }

                    res.status(200).send(result)
                } catch (e) {

                }
                stop(req)*/
        res.end();
    }));
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};
exports.serve = serve;
