# `@zayith/default-loader`

This package contains the default loader for [Zayith](https://npm.im/zayith).

The default loader reads test files using `fs.readFileSync`, then transforms them using Babel.
If it finds a babel config in your project, it uses it.
Otherwise, it uses a default Babel config.