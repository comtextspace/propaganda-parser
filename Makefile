install:
	yarn install

test:
	yarn test

import:
	node ./index.js import

export:
	node ./index.js export

lint:
	yarn lint

lintfix:
	yarn lint:fix