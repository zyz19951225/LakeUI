### 目录

目前项目目录结构如下：

```
/
|-- babel.config.js  	//babel配置文件
|-- jest							//jest配置文件
|   |-- jestSetup.js
|   `-- mountTest.js
|-- lerna.json		//lerna配置文件
|-- package.json		//父package.json
|-- packages		
|   `-- basic-component		//基础组件库
|       |-- README.md
|       |-- dist		//打包文件路径
|       |   |-- assets
|       |   |   `-- output-a0529d6b.css
|       |   |-- bundle.cjs.js
|       |   `-- bundle.ems.js
|       |-- package.json	//子项目package.json
|       |-- src
|       |   |-- Button		//组件文件夹
|       |   |   |-- __tests__		//测试文件夹
|       |   |   |   `-- Button.test.js		//测试文件
|       |   |   `-- src
|       |   |       |-- index.scoped.scss	//组件样式文件
|       |   |       `-- index.tsx		//组件
|       |   |-- Header
|       |   |   |-- __tests__
|       |   |   |   `-- Header.test.js
|       |   |   `-- src
|       |   |       |-- header.css
|       |   |       `-- index.tsx
|       |   `-- index.tsx
|       `-- stories		//storybook文件夹
|           |-- Button 		//根据组件分类的stories文件夹
|           |   `-- Button.stories.tsx
|           `-- header
|               `-- Header.stories.tsx
|-- rollup.build.ts		//rollup打包配置文件
|-- tsconfig.extend.json	//ts配置文件（提取复用）
|-- tsconfig.json				//ts配置文件
|-- tsconfig.rollup.json		//rollup
|-- yarn.lock
```
