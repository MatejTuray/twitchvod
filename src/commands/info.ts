import {Command, flags} from '@oclif/command'
import axios from 'axios'
import cli from 'cli-ux'

const moment = require('moment')
const color = require('colors-cli')
require('dotenv').config()
const client: string = process.env.TWITCH_CLIENT as string
export default class Info extends Command {
  static description = 'Fetches basic information about Twitch.tv video'

  static examples = [
    `$ twitchvod info https://www.twitch.tv/videos/401113393

   `
  ]

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'vod'}]

  async run() {
    const warn = color.yellow
    const green = color.green
    const red = color.red
    const {args} = this.parse(Info)
    const tokenObj = {
      client_id: client
    }
    const headers = {'Client-ID': 'bc0jezu5plohhw08pud3z5bpojodr9'}
    if (args.vod) {
      const url = args.vod
      cli.action.start('Fetching information', 'running', {stdout: true})
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
          {headers}
        )
        .then(res => {
          cli.action.stop(green('√'))
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
        .catch(e => this.log(red(e + '\nUnable to find video with this ID')))
    } else {
      this.log(red('Error: No url or video id provided'))
      this.log(warn('Run the command with --help flag to learn more'))
    }
  }
}
