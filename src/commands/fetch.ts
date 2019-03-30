import { flags, Command } from "@oclif/command";
const color = require("colors-cli");
const getTwitchLink = require("node-twitch-link");
let ffmpeg = require("fluent-ffmpeg");
import cli from "cli-ux";
const path = require("path");
const _cliProgress = require("cli-progress");
export default class Fetch extends Command {
  static description = "Downloads and processes Twitch.tv video";

  static examples = [
    `$ twitchvod hello
hello world from ./src/hello.ts!
`
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    res: flags.string({
      char: "r",
      description: "Video resolution",
      default: "chunked",
      options: [
        "chunked",
        "720p60",
        "720p30",
        "480p30",
        "360p30",
        "180p30",
        "160p30",
        "audio_only"
      ]
    }),
    out: flags.string({
      char: "o",
      description: "Output file path",
      default: ""
    })
  };

  static args = [
    {
      name: "vod",
      required: true,
      description: "Link to twitch VOD url or ID"
    }
  ];

  async run() {
    const warn = color.yellow;
    const green = color.green;
    const red = color.red;
    const { args, flags } = this.parse(Fetch);
    const tokenObj = {
      client_id: "bc0jezu5plohhw08pud3z5bpojodr9"
    };
    const headers = { "Client-ID": tokenObj.client_id };
    if (args.vod && flags.res) {
      const twitchUrl = args.vod;
      let percent = "0";
      //axios.get();
      cli.action.start("Fetching video links", `running`, {
        stdout: true
      });
      const link = `${
        twitchUrl.indexOf("/") === -1
          ? `https://twitch.tv/videos/${twitchUrl}`
          : twitchUrl
      }`;
      cli.action.stop(green("done!"));
      console.log(warn("Converting video..."));
      getTwitchLink(link, tokenObj)
        .then((linkArray: any) => {
          const bar = new _cliProgress.Bar(
            { stream: process.stdout },
            _cliProgress.Presets.shades_classic
          );
          const video = linkArray.find(
            (link: { type: string | undefined }) => link.type === flags.res
          );
          if (!video) {
            const resolutionArray: any[] = linkArray.map(
              (item: { type: any }) => item.type
            );
            console.log(
              warn(
                "Provided resolution not found, try running --res=option with these options"
              ),
              warn(resolutionArray)
            );
          }
          ffmpeg(video.url)
            .on("error", (error: string | undefined) => {
              console.log(error);
            })
            .on("end", () => {
              bar.stop();
              console.log(green("Video converted"));
            })
            .on("start", () => {
              bar.start(100, 0);
            })
            .on("progress", (progress: { percent: number }) => {
              percent = progress.percent.toPrecision(4).toString();
              7;
              bar.update(percent);
            })
            .outputOptions(["-c copy", "-bsf:a aac_adtstoasc", "-f mp4"])
            .save(flags.out + twitchUrl + ".mp4");
        })
        .catch((e: Error) => this.log(red(e.toString())));
    } else if (args.vod && !flags.res) {
      const url = args.vod;
      cli.action.start("Fetching video links", "running", { stdout: true });
      const link = `${
        url.indexOf("/") === -1 ? `https://twitch.tv/videos/${url}` : url
      }`;
      console.log(link);
      getTwitchLink(link, tokenObj)
        .then((linkArray: any) => {
          cli.action.stop(green("done!"));
          let resolutions: any = linkArray.map(
            (item: { type: any }) => item.type
          );
          console.log(resolutions);
        })
        .catch((e: Error) => this.log(red(e.toString())));
    } else {
      console.log(red("Error: No url or video id provided"));
      console.log(warn("Run the command with --help flag to learn more"));
    }
  }
}
