# twitchvod

CLI to retrieve Twitch.tv VODs

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/twitchvod.svg)](https://npmjs.org/package/twitchvod)
[![Codecov](https://codecov.io/gh/MatejTuray/twitchvod/branch/master/graph/badge.svg)](https://codecov.io/gh/MatejTuray/twitchvod)
[![Downloads/week](https://img.shields.io/npm/dw/twitchvod.svg)](https://npmjs.org/package/twitchvod)
[![License](https://img.shields.io/npm/l/twitchvod.svg)](https://github.com/MatejTuray/twitchvod/blob/master/package.json)
![Build](https://travis-ci.org/MatejTuray/twitchvod.svg?branch=master)

<!-- toc -->

- [twitchvod](#twitchvod)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g twitchvod
$ twitchvod COMMAND
running command...
$ twitchvod (-v|--version|version)
twitchvod/0.0.0 win32-x64 node-v10.15.1
$ twitchvod --help [COMMAND]
USAGE
  $ twitchvod COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`twitchvod fetch VOD`](#twitchvod-fetch-vod)
- [`twitchvod help [COMMAND]`](#twitchvod-help-command)
- [`twitchvod info [VOD]`](#twitchvod-info-vod)

## `twitchvod fetch VOD`

Downloads and processes Twitch.tv video

```
USAGE
  $ twitchvod fetch VOD

ARGUMENTS
  VOD  Link to twitch VOD url or ID

OPTIONS
  -h, --help                                                       show CLI help
  -o, --out=out                                                    Output file path

  -r, --res=chunked|720p60|720p30|480p30|360p30|160p30|audio_only  [default: chunked] Video resolution (chunked is the
                                                                   highest quality)

EXAMPLE
  $ twitchvod fetch 401113393 --res=720p60 --out=Some path for output file here
```

_See code: [src\commands\fetch.ts](https://github.com/MatejTuray/twitchvod/blob/v0.0.0/src\commands\fetch.ts)_

## `twitchvod help [COMMAND]`

display help for twitchvod

```
USAGE
  $ twitchvod help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src\commands\help.ts)_

## `twitchvod info [VOD]`

Fetches basic information about Twitch.tv video

```
USAGE
  $ twitchvod info [VOD]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ twitchvod info https://www.twitch.tv/videos/401113393
```

_See code: [src\commands\info.ts](https://github.com/MatejTuray/twitchvod/blob/v0.0.0/src\commands\info.ts)_

<!-- commandsstop -->
