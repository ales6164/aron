import express from "express";

import * as path from "path";
import glob from "glob"

const holder = {
    context: null,
    took: false,
}

export const start = (req: any, ...params: any) => {
    if (holder.context !== null) {
        console.log("context is acutly", holder.context)
        throw new Error("Context leak")
    }
    const [context] = params
    holder.context = context
    holder.took = false
    return true
}

const take = () => {
    const {context} = holder
    holder.context = null
    holder.took = true
    return context
}

export const stop = (req: any) => {
    if (holder.took && holder.context !== null) {
        throw new Error("Context leak")
    }
    return true
}

export const useRouter = (routes: Object) => {
    return {
        root: () => {
            const context = take()
            console.log("context", context)
            return routes["/"]()
        }
    }
}

/*export const html = (strings: TemplateStringsArray) => {
    return `<!DOCTYPE html>${strings.join("")}`;
}*/

let app

export const initCLI = async (cwd, options) => {
    app = express();

    const indexPath = path.join(cwd, options.index)

    console.log(indexPath, path.dirname(indexPath))

    const Index = await import(indexPath)

    const globOptions = {
        cwd: path.dirname(indexPath),
        nodir: true,
        nosort: true,
        ignore: null,
    }
    if (options.ignore) {
        globOptions.ignore = options.ignore
    }

    console.log("options", globOptions)

    const pages = glob.sync("**/*.js", globOptions)

    console.log(pages)

    for (let i = 0; i < pages.length; i++) {

    }
}

export const serve = (routes: any) => {

    app.get("*", async (req, res, next) => {

        console.log(req.path, req.method)
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
        res.end()
    })

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })

}
