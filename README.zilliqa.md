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

## Starting for development

.. because I keep forgetting!

```
export VITE_ERIGON_URL=<url>
npm run assets-start
npm start
```