const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

module.exports = ({ Command, utils, config }, options) => {
  const { log, checkDir } = utils
  const { pageDir } = config
  class SubCommand extends Command {
    async run () {
      if (!checkDir()) {
        return
      }
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Please enter the new page name',
            validate: function (value) {
              if (!value) {
                return 'The page name is required'
              }
              if (fs.existsSync(path.resolve(pageDir, value))) {
                return 'The page is existed'
              }
              return true
            }
          }
        ])
        .then(answers => {
          this.pageName = answers.name
          this.createNewPage()
        })
    }

    get description () {
      return 'Create a new page'
    }

    createNewPage () {
      const dir = path.join(pageDir, this.pageName)
      const html = `<!doctype html>
<html>
<head>
  <title></title>
</head>
<body>
</body>
</html>
  `
      fs.mkdirSync(dir)
      fs.writeFileSync(path.join(dir, 'index.js'), '')
      fs.writeFileSync(path.join(dir, 'index.html'), html)
      log.info(`Success to create ${this.pageName}，please restart the serve`)
    }
  }
  return SubCommand
}
