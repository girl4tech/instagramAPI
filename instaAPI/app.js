$.ready(isRedirectedURI())

function isRedirectedURI() {
  // get access token from hash/fragment
  var uriHash = window.location.hash

  // if there's an access token available get images
  if (localStorage.igToken || uriHash.length > 0) {
    if (localStorage.igToken) {
      getImages(localStorage.igToken)
    } else {
      // get access token from URI
      var accessToken = uriHash.replace('#access_token=', '')
      getImages(accessToken)
    }
  } else {
    // if not yet redirected hide results view
    $('.image-results-view').hide()
  }
}

function getImages(accessToken) {
  // if redirected hide initial view
  $('.sign-in-view').hide()

  // check if navigator geolocation is available from the browser's Window
  if (navigator.geolocation) {

    // store accessToken locally so user doesn't have to make an API to call it again if they close the window and come back
    localStorage.igToken = accessToken

    // use the navigator given to us by the window.navigator object to find the user's location
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude
      var lng = position.coords.longitude

      // configure instagram endpoint with accessToken and user's location data
      var instagramEndpoint = 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&access_token=' + accessToken
      
      // call the instagram with configured URI
      $.ajax({
        url: instagramEndpoint,
        method: 'GET',
        dataType: 'jsonp',
        success: handleResponseSuccess
      })
    })
  } else {
    $('.images').append('Sorry, the browser does not support geolocation')
  }
}

function handleResponseSuccess(response) {
  var allData = response.data
  console.log(response)
  // iterate through each piece of data
  allData.forEach(function(data) {
    var imageUrl = 'url(' + data.images.standard_resolution.url + ')'

    // create element
    var element = $('<div></div>').css({'background-image': imageUrl}).addClass('image')

    // append element to .images node
    $('.images').append(element)
  })
}
