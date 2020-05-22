// Import the plugins
const Uppy = require('@uppy/core')
const XHRUpload = require('@uppy/xhr-upload')
const Dashboard = require('@uppy/dashboard')
//const Form = require('@uppy/form')

// And their styles (for UI plugins)
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')

// didn't work, not sure why
//var css = new CleanCSS().minify(['@uppy/core/dist/style.css','@uppy/dashboard/dist/style.css'])

const uppy = Uppy({
  restrictions: {
  // maxFileSize: 4000000,
  allowedFileTypes: ['image/*']
  },
  // onBeforeUpload: (files) => {
  //   Object.keys(files).forEach(fileID => {
  //   console.log(files[fileID].name)
  //   })
  // console.log("the files: " + files);
  // }
})
  .use(Dashboard, {
  trigger: '#select-files',
  // inline: true,
  // height: 300,
  metaFields: [
    { id: 'item-description', name: 'Item description', placeholder: 'description'},
    { id: 'item-price', name: 'Item price', placeholder: 'price'}
  ],
  })
  .use(XHRUpload, {
  // needs to be set to false for metadata to get sent
  // bundle: true, 
  endpoint: '/gallery',
  method: 'post',
  formData: true,
  fieldName: 'files'
  })

uppy.on('complete', (result) => {
  // redirect from frontend due to AJAX
  //window.location.assign("/gallery");
  console.log('Upload complete! We’ve uploaded these files:', result.successful)
})
