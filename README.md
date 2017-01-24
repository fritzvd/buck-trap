# buck-trap
Buck Trap helps you to BUmp Changelog Kiss Tag Release And Publish your repo

![Buck Trap](http://orig04.deviantart.net/6358/f/2012/033/3/9/deer_sketches_by_redbuzzardart-d4ofk0z.jpg "Bucks by Nadia van der Donk")

## Usage

    npm install --save-dev buck-trap

Now add the following to your package.json scripts section

	"buck-trap": "buck-trap -a"

So e.g.:

	"scripts": {
		"test": "tape tests/*",
		"buck-trap": "buck-trap -a"
	},
	"dependencies": { 
	    "buck-trap": "1.0.14"
	}

Or if you don't like the defaults (`deploy/auth.json` for the token file and `dist` folder for the build folder)

    "buck-trap": "buck-trap -a -t /absoulute/path/to/auth.json-file -af /absoulute/path/to/dist/folder"

Also add the name of your project to the repository section:
    "name": "organisation/repo-name"

So for example:
	"repository": {
		"type": "git",
		"url": "git+https://github.com/nens/buck-trap.git",
		"name": "nens/buck-trap"
	},


The auth.json file should like similar to this:

```json
{
    "token": "Your-token-that-you-created-on-github"
}
```

You can create your tokens here: https://github.com/settings/tokens
Grant the token full access under the repo section

If everything is setup run:

    npm run buck-trap

## Releasing hotfixes or patches
If a stable release is coming out release it and start a new branch for the 
stable release e.g.:

	git checkout -b release4.0 

If stuff is fixed on this branch, the fixes can be rolled out as patches without 
affecting the mainline release track.
To run buck-trap from this branch and to release the branch with its `CHANGELOG.md`

	npm run buck-trap -- -b release4.0

The fixes and the `CHANGELOG.md` would have to be merged with master, which might 
give some merge conflicts. C'est la vie.


