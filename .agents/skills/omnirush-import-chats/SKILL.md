---
name: omnirush-import-chats
description: "Move saved OmniRush CLI chats into the OmniRush desktop app. Copy the CLI chat database, export each chat in the desktop format with the desktop engine, and import it without touching the original CLI data."
---

# Move CLI chats into the desktop app

The OmniRush CLI and the desktop app save chats in different formats.
Copying the files across does not work. The desktop engine can read a copy of
the CLI's chat database, upgrade it, and export each chat in its own format.
Then the same engine imports those chats into the desktop app's data.

Run every engine command here with `--standalone`. Without it, the command
talks to a shared background service instead of the folder you chose.

## Check before starting

- The CLI keeps chats in `~/.local/share/omnirush/opencode.db`.
- The desktop app keeps chats in `~/.local/share/opencode/opencode.db`.
- On another system, or when a file is missing, find the real folders first. Do not guess.
- Ask the user to quit the CLI and the desktop app.
- Find the engine version the desktop app ships and use exactly that version.
  Ask the user when you cannot find it. Version `2.0.18` was tested.
- Node.js and `npx` are needed to run the engine. Report a missing runtime as a gap.
- Chats can hold private code and secrets. Keep every copy and export in a
  scratch folder outside any project repository. Never commit them.
- Copy only `opencode.db`. Leave `auth.json` and other login files alone.

## Copy the CLI chats

Make a consistent copy. Never open or change the original CLI database.

```sh
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/cli/opencode" "$SCRATCH/exports"
sqlite3 ~/.local/share/omnirush/opencode.db ".backup '$SCRATCH/cli/opencode/opencode.db'"
```

Without `sqlite3`, copy `opencode.db` with its `-wal` and `-shm` files while
the CLI is closed.

List the chats in the copy. Parent chats have an empty `parent_id`;
subagent chats point at their parent.

```sh
sqlite3 "$SCRATCH/cli/opencode/opencode.db" \
  "select id, parent_id, title, directory from session where time_archived is null order by time_created"
```

Agree with the user which chats to move. `session list` is limited to one
project folder, so use this query for the full list.

## Export in the desktop format

Point the desktop engine at the copy and export each chosen chat, subagent
chats included.

```sh
XDG_DATA_HOME="$SCRATCH/cli" npx -y @opencode/cli@<version> session export --standalone <session-id> > "$SCRATCH/exports/<session-id>.json"
```

Check each export: it is JSON with `info` and `messages`, and each message has
an `id` and a `type`. Stop and report the error output if an export fails.

## Import into the desktop app

Back up the desktop data first.

```sh
cp -R ~/.local/share/opencode "$SCRATCH/desktop-backup"
```

Import parent chats before their subagent chats. Use the normal data folder,
so do not set `XDG_DATA_HOME` here.

```sh
npx -y @opencode/cli@<version> session import --standalone "$SCRATCH/exports/<session-id>.json"
```

Add `--directory <folder>` when the user's project now lives in a different
folder from the one the chat recorded.

## Verify the move

- Export one imported chat again from the desktop data and compare its
  `messages` with the first export. They should match. The importer resets
  project, folder, and update time, so those fields can differ.
- Ask the user to open the desktop app and find the moved chats.
- On a failure, restore the backup: quit the app, then copy
  `$SCRATCH/desktop-backup` back over `~/.local/share/opencode`.

## Tell the user about uploads

The CLI already uploaded these chats. The desktop app sends nothing for an
imported chat until the user continues it. The first new turn in a moved chat
may upload its older messages again. Tell the user before they continue one.

No supported path moves desktop chats back into the CLI.

Finish with the chats moved, the checks that ran, where the backup is, and
when the scratch folder can be deleted.
