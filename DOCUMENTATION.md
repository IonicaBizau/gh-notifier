## Documentation

You can see below the API reference of this module.

### `githubNotify(token, interval, callback)`
Creates requests to the GitHub private atom stream and calls the callback
function when there is a new item in the stream.

#### Params

- **String** `token`: The GitHub token.
- **Number** `interval`: The number of milliseconds between requests.
- **Function** `callback`: The callback function.

#### Return
- **PageChanged** The [`PageChanged`](https://github.com/IonicaBizau/node-page-changed) instance.

