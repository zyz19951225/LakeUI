import chalk from 'chalk' // 控制台输出彩色文案
import execa from 'execa' // 开启子进程执行命令，https://www.npmjs.com/package/execa
import fse from 'fs-extra' // file system的扩展方法，此处用它同步读取json
import globby from 'globby' // 增强版本glob，此处用它同步匹配文件名
import path from 'path' //路径工具
import { InputOptions, OutputOptions, rollup } from 'rollup'
import commonjs from 'rollup-plugin-commonjs'
import scss from 'rollup-plugin-scss'
import nodeResolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import ts from 'typescript'
import yargs from 'yargs-parser'
import {fileURLToPath} from 'url';
import {createRequire} from "node:module";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const lernaJson = require('./lerna.json')


interface IOpt extends InputOptions {
    output: OutputOptions[]
}

// 命令要做什么，all则编译所有包，changed则编译发生改变的包，默认为all
const argv = yargs(process.argv)
const type: 'all' | 'changed' | undefined = argv.type

export class Run {
    /**
     * 流程函数
     * @param ohterPkgPaths 其他包，可用来排除
     * @param external 排除不打包到dish里面的包
     */
    public async build(ohterPkgPaths: string[] = [], external: string[] = []) {
        const pkgPaths: string[] = this.getPkgPaths(lernaJson.packages)

        // rollup配置列表
        const rollupConfigList = [...pkgPaths, ...ohterPkgPaths].map<any>(
            (pPath) => {
                const pkg = fse.readJsonSync(pPath)
                const libRoot = path.join(pPath, '..')
                const isTsx = fse.existsSync(path.join(libRoot, 'src/index.tsx'))
                console.log(isTsx,"-=-==-=-=-=-==-=-----------")
                return {
                    input: path.join(libRoot, isTsx ? 'src/index.tsx' : 'src/index.ts'),
                    plugins: [
                        scss(), // 我们这里用scoped scss来写样式，所以打包使用scss预处理样式
                        nodeResolve({
                            extensions: ['.js', '.jsx', '.ts', '.tsx'],
                        }),
                        typescript({
                            check: false,
                            tsconfigOverride: {
                                compilerOptions: {
                                    baseUrl: libRoot,
                                    outDir: path.join(libRoot, 'dist'),
                                    allowSyntheticDefaultImports: true,
                                },
                                include: [path.join(libRoot, 'src')],
                            },
                            typescript: ts,
                            tsconfig: path.join(__dirname, 'tsconfig.json'),
                        }),
                        commonjs({
                            include: path.join(__dirname, 'node_modules/**'),
                        }),
                    ],
                    external: [
                        ...Object.keys(pkg.dependencies || {}),
                        ...(pkg.external || []),
                        ...external,
                    ],
                    output: [
                        {
                            file: path.join(libRoot, pkg.main),
                            format: 'cjs',
                            exports: 'named',
                            globals: {
                                react: 'React',
                            },
                        },
                        {
                            file: path.join(libRoot, pkg.module),
                            format: 'esm',
                            exports: 'named',
                            globals: {
                                react: 'React',
                            },
                        },
                    ],
                } as IOpt
            }
        )

        for (const opt of rollupConfigList) {
            console.log(chalk.hex('#009dff')('building: ') + opt.input)

            // 打包
            const bundle = await rollup({
                input: opt.input,
                plugins: opt.plugins,
                external: opt.external,
            })

            // 输出
            for (const out of opt.output) {
                // await bundle.generate(outOpt)
                await bundle.write(out)
                console.log(chalk.hex('#3fda00')('output: ') + out.file)
            }
        }
    }

    /**
     * 打印找到发生改变的包的日志
     * @param changes 发生改变的pkg
     */
    private logFindChanged(
        changes: Array<{ name: string; location: string; version: string }>
    ) {
        const logInfo = chalk
            .hex('#009dff')
            .bold('find changed: ' + (changes.length === 0 ? 'nothing changed' : ''))
        console.log(logInfo)

        changes.map((item) => {
            console.log(item.name)
        })
    }

    /**
     * 获得需要编译的包的package
     * @param lernaPkg lerna.json中的packages
     */
    private getPkgPaths(lernaPkg: string[]) {
        const lernaPkgPaths = lernaPkg.map((p) =>
            path.join(__dirname, p, 'package.json').replace(/\\/g, '/')
        )
        if (type === 'changed') {
            const changes = this.getChangedPkgPaths()
            // 如果发生改变，输出日志
            this.logFindChanged(changes)
            return changes.map((p) => path.join(p.location, 'package.json'))
        }
        return globby.sync(lernaPkgPaths)
    }

    /**
     * 获得发生改变的包
     */
    private getChangedPkgPaths(): Array<{
        name: string
        location: string
        version: string
    }> {
        const { stdout } = execa.sync('lerna changed --json')
        const matchPkgStr = stdout.replace(/[\r\n]/g, '').match(/{.+?}/g)
        return (matchPkgStr || []).map((item) => {
            return JSON.parse(item)
        })
    }
}

const run = new Run()

run.build()
