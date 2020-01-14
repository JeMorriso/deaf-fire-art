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
    bundle: true, 
    endpoint: '/gallery',
    method: 'post',
    formData: true,
    fieldName: 'files'
  })

uppy.on('complete', (result) => {
  // redirect from frontend due to AJAX
  window.location.assign("/gallery");
  //console.log('Upload complete! We’ve uploaded these files:', result.successful)
})