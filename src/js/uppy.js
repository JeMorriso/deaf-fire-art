// Import the plugins
const Uppy = require('@uppy/core')
const XHRUpload = require('@uppy/xhr-upload')
const Dashboard = require('@uppy/dashboard')
// const CleanCSS = require('clean-css')

// And their styles (for UI plugins)
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')

// didn't work, not sure why
//var css = new CleanCSS().minify(['@uppy/core/dist/style.css','@uppy/dashboard/dist/style.css'])

const uppy = Uppy()
  .use(Dashboard, {
    trigger: '#select-files'
  })
  .use(XHRUpload, { 
    endpoint: 'http://localhost:3000/gallery',
    method: 'post'})

uppy.on('complete', (result) => {
  console.log('Upload complete! We’ve uploaded these files:', result.successful)
})