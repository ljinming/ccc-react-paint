#install
yarn add ccc-react-paint

you need to have in your dependencies:

```
    "@material-ui/core": "^4.11.2",
    "react": "^17.0.1",
    "antd",
    "antd/icon",
    "prop-types"
```

registry https://registry.npm.taobao.org

{
"extends": "./paths.json",
"compilerOptions": {
"target": "es5",
"sourceMap": true,
"lib": [
"dom",
"dom.iterable",
"esnext"
],
"jsx": "react-jsx",
"skipLibCheck": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"strict": true,
"allowUnusedLabels": true,
"forceConsistentCasingInFileNames": true,
"noFallthroughCasesInSwitch": true,
"module": "esnext",
"moduleResolution": "node",
"resolveJsonModule": true,
"isolatedModules": true,
"noEmit": true,
"allowJs": true,
"baseUrl": ".",
"noUnusedLocals": false,
"noUnusedParameters": false,
"importHelpers": true,
"declaration": true,
"noImplicitReturns": true,
"suppressImplicitAnyIndexErrors": true,
"experimentalDecorators": true
},
"include": [
"src",
"./index.d.ts"
],
"paths": {
"@/src": ["src/*"],
"@/components": ["src/components"],
"@/util": ["src/util"],
"@/context": ["src/context"],
"@/assets": ["src/assets"],
"@/icon": ["src/assets/icon"],
"@/tool":["src/tool"],
"@/pages":["src/pages"]
}
}
