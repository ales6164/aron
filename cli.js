#!/usr/bin/env node

import commandLineArgs from 'command-line-args'
import {initCLI} from "./lib/index.js";


const optionDefinitions = [
    //{ name: 'verbose', alias: 'v', type: Boolean },
    {name: 'index', type: String, multiple: false, defaultOption: true},
    {name: 'ignore', type: String, multiple: true},
    //{ name: 'timeout', alias: 't', type: Number }
]
const options = commandLineArgs(optionDefinitions)

await initCLI(process.cwd(), options)
