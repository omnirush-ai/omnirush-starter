# Bundled Best practices

[bundles/best-practices.json](../bundles/best-practices.json) is the portable
guide pack for OmniRush clients. It contains a short instruction, ten guides,
the MIT notice, and the canonical source revision and hashes.

The guides use each project's existing instructions, tools, and checks. They
do not require the starter's files or command runner. Keep the project starter
for people who want its full repository layout.

Client integrations load the pack by default. A local Best practices setting
controls its prompt and skill catalog. The CLI command is `/best-practices on`,
`/best-practices off`, or `/best-practices status`. The GUI switch belongs in
Settings > General. Apply a change without interrupting active work. Report an
application failure separately from a saved preference. Earlier guide content
can remain in chat history.

Vendor the same JSON bytes in each client. Load the packaged files locally.
Keep the preference outside project files. Keep raw private notes in their
existing private location. Do not add a data collector, account sync, or runtime
download for this feature. Preserve existing account and consent behavior.

When changing source guides, review the portable adaptation in
[bundle-best-practices.mjs](../scripts/bundle-best-practices.mjs). Update its
`SOURCE_COMMIT` to the canonical skill revision, then run:

```sh
npm run bundle:best-practices
npm run check:starter
```

Verify the client package, default loading, off/on behavior, and restart
persistence before releasing a new client bundle.
