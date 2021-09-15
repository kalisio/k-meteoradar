const moment = require('moment')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const krawler = require('@kalisio/krawler')
const hooks = krawler.hooks

const imagePattern = 'YYYYMMDD_HHmm_[Radar].png'
const storePattern = 'YYYY/MM/DD/HHmm.tif'
const workingDir = './output'
const frequency = 900000    // every 15 minutes
const history = 12

// Create a custom hook to generate tasks
let generateTasks = (options) => {
  return function (hook) {
    // Compute the nearest round time fron 'now'
    let nearestTime = Math.floor(moment().utc() / frequency) * frequency
    // Compute the tasks to be performed according the history
    let tasks = []
    for (let i = 4; i < history + 4; i++) {
      const time = moment(nearestTime - i * frequency).utc()
      const imageName = time.format(imagePattern)
      // Check whether it needs to donwload the data or not
      console.log('checking ', imageName)
      if(!fs.existsSync(path.join(workingDir, imageName))) {
        console.log('processing ', imageName)
        if (!fs.existsSync(workingDir)) mkdirp.sync(workingDir)
        tasks.push({
          id: imageName,
          options: {
            url: 'https://donneespubliques.meteofrance.fr/donnees_libres/Carto/' + imageName,
            inputFile: path.join(workingDir, imageName),
            outputFile: path.join(workingDir, imageName.replace('png', 'tif')),
            fsKey: imageName.replace('png', 'tif'),
            storeKey: time.format(storePattern)
          }
        })
      }
    }
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

// Create a custom hook to remove the files older than 4 hours
let clearWorkingDir = (options) => {
  return function (hook) {
    fs.readdirSync(workingDir).forEach(file => {
      const filePath = path.join(workingDir, file)
      const stats = fs.statSync(filePath) 
      const now = new Date().getTime()
      const endTime = new Date(stats.mtime).getTime() + 14400000 // 4 hours in miliseconds 
      if (now > endTime) fs.unlinkSync(filePath)
    })
    return hook
  }
}
hooks.registerHook('clearWorkingDir', clearWorkingDir)

module.exports = {
  id: 'metaoradar',
  store: 'fs',
  options: {
    workersLimit: 1,
    faultTolerant: true
  },
  taskTemplate: {
    type: 'http',
    store: 'fs',
    faultTolerant: true
  },
  hooks: {
    tasks: {
      after: {
        runCommand: {
          command: '"./transform.sh" "<%= options.inputFile %>" "<%= options.outputFile %>"'
        },
        copyToStore: {
          match: { predicate: () => process.env.S3_BUCKET },
          input: { key: '<%= options.fsKey %>', store: 'fs' },
          output: { key: '<%= options.storeKey %>', store: 's3' }
        },
      },
    },
    jobs: {
      before: {
        createFStore: {
          hook: 'createStore',
          id: 'fs',
          options: {
            path: workingDir
          },
          storePath: 'taskTemplate.store'
        },
        createS3Store: {
          hook: 'createStore',
          match: { predicate: () => process.env.S3_BUCKET },
          id: 's3',
          options: {
            client: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION,
              accessKeyId: process.env.S3_ACCESS_KEY,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            },
            bucket: process.env.S3_BUCKET
          }
        },
        generateTasks: {}
      },
      after: {
        clearWorkingDir: {},
        removeFSStore: {
          hook: 'removeStore',
          id: 'fs'
        },
        removeS3Store: {
          hook: 'removeStore',
          match: { predicate: () => process.env.S3_BUCKET },
          id: 's3'
        }
      },
      error: {
        removeFSStore: {
          hook: 'removeStore',
          id: 'fs'
        },
        removeS3Store: {
          hook: 'removeStore',
          match: { predicate: () => process.env.S3_BUCKET },
          id: 's3'
        }
      }
    }
  }
}

