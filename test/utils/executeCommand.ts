const {exec} = require('child_process')
const path = require('path')
const executeCommand = (
  args: string[],
  done: {(stderr: any, stdout: any): void; (arg0: any, arg1: any): void}
) => {
  args.unshift(
    'node',
    path.resolve(path.join(__dirname, '..', '..', 'bin', 'twitchvod'))
  )

  exec(args.join(' '), (err: any, stdout: any, stderr: any) => {
    done(stderr, stdout)
  })
}

export default executeCommand
