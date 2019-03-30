import { Command, flags } from "@oclif/command";
import axios from "axios";
const moment = require("moment");
const color = require("colors-cli");
import cli from "cli-ux";

export default class Info extends Command {
  static description = "Fetches basic information about Twitch.tv video";

  static examples = [
    `$ twitchvod hello
hello world from ./src/hello.ts!
`
  ];

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [{ name: "vod" }];

  async run() {
    const warn = color.yellow;
    const green = color.green;
    const red = color.red;
    const { args, flags } = this.parse(Info);
    const tokenObj = {
      client_id: "bc0jezu5plohhw08pud3z5bpojodr9"
    };
    const headers = { "Client-ID": tokenObj.client_id };
    if (args.vod) {
      const url = args.vod;
      cli.action.start("Fetching information", "running", { stdout: true });
      interface InfoObj {
        name: string;
        title: string;
        game: string;
        length: any;
        created_at: any;
        views: any;
        language: string;
        resolutions: JSON;
      }
      axios
        .get(
          `https://api.twitch.tv/kraken/videos/${
            url.indexOf("/") !== -1 ? url.substr(url.lastIndexOf("/") + 1) : url
          }`,
          { headers }
        )
        .then(res => {
          cli.action.stop(green("complete!"));
          let infoObj: InfoObj = {
            name: res.data.channel.name,
            title: res.data.title,
            game: res.data.game,
            length: moment(res.data.length * 1000 - 60 * 60 * 1000).format(
              "HH:mm:ss"
            ),
            created_at: moment(res.data.created_at).format("DD/MM/YYYY"),
            views: res.data.views,
            language: res.data.language,
            resolutions: res.data.resolutions
          };
          this.log(JSON.stringify(infoObj, null, 4));
        })
        .catch(e => this.log(red(e)));
    } else {
      console.log(red("Error: No url or video id provided"));
      console.log(warn("Run the command with --help flag to learn more"));
    }
  }
}
