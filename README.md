# buck-trap
Buck Trap helps you to BUmp Changelog Kiss Tag Release and Publish your repo

![Buck Trap](http://orig04.deviantart.net/6358/f/2012/033/3/9/deer_sketches_by_redbuzzardart-d4ofk0z.jpg "Bucks by Nadia van der Donk")

## Usage

    npm install --save-dev buck-trap

Now add the following to your package.json scripts section

    "buck-trap" "buck-trap -a -t ./path/to/auth.json-file -af path/to/dist/folder"


The auth.json file should like similar to this:

```json
{
    "token": "Your-token-that-you-created-on-github"
}
```

You can create your tokens here: https://github.com/settings/tokens
Grant the token full access under the repo section
