import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
const color = require('colors-cli')
const getTwitchLink = require('node-twitch-link')
const ffmpeg = require('fluent-ffmpeg')
require('dotenv').config()
const _cliProgress = require('cli-progress')
const notifier = require('node-notifier')
const path = require('path')

export default class Fetch extends Command {
  static description = 'Downloads and processes Twitch.tv video'

  static examples = [
    `$ twitchvod fetch 401113393 --res=720p60 --out=Some path for output file here
`
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    res: flags.string({
      char: 'r',
      description: 'Video resolution (chunked is the highest quality)',
      default: 'chunked',
      options: [
        'chunked',
        '720p60',
        '720p30',
        '480p30',
        '360p30',
        '160p30',
        'audio_only',
        'high',
        'low',
        'medium',
        'mobile'
      ]
    }),
    out: flags.string({
      char: 'o',
      description: 'Output file path',
      default: ''
    })
  }

  static args = [
    {
      name: 'vod',
      required: true,
      description: 'Link to twitch VOD url or ID'
    }
  ]

  async run() {
    const warn = color.yellow
    const green = color.green
    const red = color.red
    const {args, flags} = this.parse(Fetch)
    const tokenObj = {
      client_id: 'bc0jezu5plohhw08pud3z5bpojodr9'
    }
    if (args.vod && flags.res) {
      const twitchUrl = args.vod
      cli.action.start('Fetching video links', 'running', {
        stdout: true
      })
      const link = `${
        twitchUrl.indexOf('/') === -1
          ? `https://twitch.tv/videos/${twitchUrl}`
          : twitchUrl
      }`
      cli.action.stop(green('√'))
      const output =
        twitchUrl.indexOf('/') === -1
          ? twitchUrl
          : twitchUrl.substr(twitchUrl.lastIndexOf('/') + 1) + '.mp4'
      getTwitchLink(link, tokenObj)
        .then((linkArray: any) => {
          const bar = new _cliProgress.Bar(
            {stream: process.stdout},
            _cliProgress.Presets.shades_classic
          )
          const video = linkArray.find(
            (link: {type: string | undefined}) => link.type === flags.res
          )
          if (!video) {
            const resolutionArray: any[] = linkArray.map(
              (item: {type: any}) => item.type
            )
            this.log(
              warn(
                'Provided resolution not found, try running --res=option with these options'
              ),
              warn(resolutionArray)
            )
          } else if (video) {
            ffmpeg(video.url)
              .on('error', (error: any) => {
                bar.stop()
                this.log(red(error))
              })
              .on('end', () => {
                bar.stop()
                this.log(green('√') + ' Video converted')
                notifier.notify({
                  title: 'TwitchVoD',
                  message: 'Your video was successfully saved',
                  icon: path.join(__dirname, 'notif.png'), // Absolute path (doesn't work on balloons)
                  sound: true // Only Notification Center or Windows Toasters
                })
              })
              .on('start', () => {
                let res = video.url.split('/')
                this.log(`Valid link found... ${green('√')}`)
                this.log(
                  `Resolution: ${res[4]}
                  `
                )

                bar.start(100, 0)
              })
              .on('progress', (progress: any) => {
                bar.update(progress.percent.toPrecision(4).toString())
              })
              .outputOptions(['-c copy', '-bsf:a aac_adtstoasc', '-f mp4'])
              .save(flags.out + output)
          }
        })
        .catch((e: any) => {
          let userError = e.toString()
          this.log(
            red(
              userError.substring(0, userError.indexOf('-')) + 'VOD not found'
            )
          )
        })
    }
  }
}
