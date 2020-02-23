# `@test-it/default-loader`

This package contains the default loader for [Test-It](https://npm.im/test-it).

The default loader reads test files using `fs.readFileSync`, then transforms them using Babel.
If it finds a babel config in your project, it uses it.
Otherwise, it uses a default Babel config.
