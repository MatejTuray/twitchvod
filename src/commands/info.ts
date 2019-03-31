import { Command, flags } from '@oclif/command'
import axios from 'axios'
const moment = require('moment')
const color = require('colors-cli')
import cli from 'cli-ux'

export default class Info extends Command {
  static description = 'Fetches basic information about Twitch.tv video'

  static examples = [
    `$ twitchvod info https://www.twitch.tv/videos/401113393

    Fetching information... complete!
    --------------------------------------------------------------------------------
    Streamer: shroud
    Title: Special Guest SOON!! #ad | @shroud on socials for updates
    Game: Apex Legends
    Video length: 08:18:36
    Video date: 25/03/2019
    Video views: 89563
    Language: en
    Resolutions: 160p30,360p30,480p30,720p30,720p60,chunked
`
  ]

  static flags = {
    help: flags.help({ char: 'h' })
  }

  static args = [{ name: 'vod' }]

  async run() {
    const warn = color.yellow
    const green = color.green
    const red = color.red
    const { args, flags } = this.parse(Info)
    const tokenObj = {
      client_id: process.env.TWITCH_CLIENT
    }
    const headers = { 'Client-ID': tokenObj.client_id }
    if (args.vod) {
      const url = args.vod
      cli.action.start('Fetching information', 'running', { stdout: true })
      interface InfoObj {
        name: string
        title: string
        game: string
        length: any
        created_at: any
        views: any
        language: string
        resolutions: any
      }
      axios
        .get(
          `https://api.twitch.tv/kraken/videos/${
            url.indexOf('/') !== -1 ? url.substr(url.lastIndexOf('/') + 1) : url
          }`,
          { headers }
        )
        .then(res => {
          cli.action.stop(green('complete!'))
          let infoObj: InfoObj = {
            name: res.data.channel.name,
            title: res.data.title,
            game: res.data.game,
            length: moment(res.data.length * 1000 - 60 * 60 * 1000).format(
              'HH:mm:ss'
            ),
            created_at: moment(res.data.created_at).format('DD/MM/YYYY'),
            views: res.data.views,
            language: res.data.language,
            resolutions: res.data.resolutions
          }
          let resArray = []
          for (let elem of Object.keys(infoObj.resolutions)) {
            let resol = infoObj.resolutions[elem]
            resArray.push(elem)
          }
          this.log('-'.repeat(80))
          this.log(`Streamer: ${infoObj.name}`)
          this.log(`Title: ${infoObj.title}`)
          this.log(`Game: ${infoObj.game}`)
          this.log(`Video length: ${infoObj.length}`)
          this.log(`Video date: ${infoObj.created_at}`)
          this.log(`Video views: ${infoObj.views}`)
          this.log(`Language: ${infoObj.language}`)
          this.log(`Resolutions: ${resArray}`)
        })
        .catch(e => this.log(red(e)))
    } else {
      console.log(red('Error: No url or video id provided'))
      console.log(warn('Run the command with --help flag to learn more'))
    }
  }
}
