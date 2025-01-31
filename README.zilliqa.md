# Zilliqa Otterscan

Here are some local notes for the Zilliqa version of otterscan

## Autogenerated files

There are some modules (`autogen/version.ts` in particular) which are
autogenerated. Because there is no way to stop Vite from trying to
analyse these, they must always be there.

Because there is no way to tell git to remember their existence but
ignore changes to them, they are generated by `npm start` as well as
`npm build`, but they are not checked into the repo.

Be warned! If you use `vite` directly, you may end up with analysis
errors due to their absence.

## Parameters

You can now pass `network=` and `name=` parameters to preload a network into `localStorage`.
For large sets of prewritten parameters, there is a list of connection objects in `config.json`.

These are overridden if we select network from your hostname.

## Configuration

There are some extra config options - see `public/config.json` for an example. In particular, `connections` is a list of potential connections, each of which is a dictionary:

- `menuName` - name that will appear in the connection menu for this option
- `url` - the URL to query
- `hostnames` - an array of hostnames. If the `window.location` hostname has one of these as a prefix, the `url` will be force-selected and the connections menu will not appear.

## Starting for development

.. because I keep forgetting!

```
export VITE_ERIGON_URL=<url>
npm run assets-start
npm start
```
