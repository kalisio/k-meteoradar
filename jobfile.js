import moment from 'moment'
import path from 'path'
import { hooks } from '@kalisio/krawler'

const imagePattern = 'YYYYMMDD_HHmm_[Radar].png'
const storePattern = 'YYYY/MM/DD/HHmm.tif'
const storePath = process.env.STORE_PATH
const frequency = 900000    // every 15 minutes
const history = 12

const outputDir = './output'

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
      console.log('processing ', imageName)
      tasks.push({
        id: imageName,
        options: {
          url: 'https://donneespubliques.meteofrance.fr/donnees_libres/Carto/' + imageName,
          inputFile: path.join(outputDir, imageName),
          outputFile: path.join(outputDir, imageName.replace('png', 'tif')),
          fsKey: imageName.replace('png', 'tif'),
          storeKey: time.format(storePattern)
        }
      })
    }
    hook.data.tasks = tasks
    return hook
  }
}
hooks.registerHook('generateTasks', generateTasks)

export default {
  id: 'meteoradar',
  store: 'fs',
  options: {
    workersLimit: 1,
    faultTolerant: true
  },
  taskTemplate: {
    type: 'http',
    faultTolerant: true
  },
  hooks: {
    tasks: {
      after: {
        gdalTransform: {
          hook: 'runCommand',
          command: '"./transform.sh" "<%= options.inputFile %>" "<%= options.outputFile %>"'
        },
        rcloneCopy: {
          hook: 'runCommand',
          match: { predicate: () => storePath },
          command: `rclone copyto ${outputDir}/<%= options.fsKey %> store:${storePath}/<%= options.storeKey %> -v`
        },
      },
    },
    jobs: {
      before: {
        createStore: {
          id: 'fs',
          options: {
            path: outputDir
          },
          storePath: 'taskTemplate.store'
        },
        generateTasks: {}
      },
      after: {
        removeStore: ['fs']
      },
      error: {
        removeStore: ['fs']
      }
    }
  }
}

