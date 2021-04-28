import configFn from './scripts/config'
const config = configFn()
module.exports = () => {
   return config
}