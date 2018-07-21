// ------------------- //
//   General Scripts   //
// ------------------- //

function openDropdown(event, id) {
  if (event.keyCode == 13 || event.which == 13) {
    if (document.getElementById(id).style.display == 'none'){
      document.getElementById(id).style.display = 'block';
    } else {
      document.getElementById(id).style.display = 'none';
    }
  }
}

function toggleMobileNav() {
  if (document.getElementById("mobileNav").style.right != "0px") {
    document.getElementById("mobileNav").style.right = "0px";
    document.getElementById("main").style.transform = "translateX(-250px)";
    document.getElementById('mobileNav-tab-anchor').focus();
  } else {
    closeMobileNav();
  }
}

function closeMobileNav() {
    document.getElementById("mobileNav").style.right = "-250px";
    document.getElementById("main").style.transform = "translateX(0px)";
}

// ------------------- //
//     Map Scripts     //
// ------------------- //

// Declare database as global variable
var map;
var mapdb = [];
var fields = [];
var fieldsLookup = {};
var countries = [];
var jemarkers = [];
var searchmarkers = [];

// "Don't show this again" cookie
function setCookie(cname) {
  var check = document.getElementById(cname).checked;
  if (check == true){
    var d = new Date();
    var exdays = 300;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = ";expires="+d.toUTCString();
    document.cookie = cname + "=" + check + expires + ";SameSite=strict;path=/";
  }
}

// Initialize map
function initMap() {
  // Map options
  var options = {
    zoom: 2,
    maxZoom: 17,
    minZoom: 2,
    center: {lat:20,lng:0},
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles:   [
                {
                  "featureType": "administrative",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#323232"
                    }
                  ]
                },
                {
                  "featureType": "landscape",
                  "elementType": "all",
                  "stylers": [
                    {
                      "saturation": "-100"
                    },
                    {
                      "lightness": "60"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "saturation": "-35"
                    },
                    {
                      "lightness": "45"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "all",
                  "stylers": [
                    {
                      "saturation": "-100"
                    },
                    {
                      "lightness": "20"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "all",
                  "stylers": [
                    {
                      "visibility": "simplified"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "all",
                  "stylers": [
                    {
                      "visibility": "on"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#97d7ec"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#24a1c8"
                    }
                  ]
                }
              ]
  }
  // Create map
  map = new google.maps.Map(document.getElementById('map'), options);
  // Set markers
  setMarkers(map);
  // Get Lists
  getFields();
  getCountries();
}

// Get Fields
function getFields() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Save server response
      fields = JSON.parse(xhttp.responseText);
      // Update fields list
      var html = '<option value="">-- Any field --</option>';
      var length = fields.length;
      for (var i = 0; i < length; i++) {
        html += '<option value="' + fields[i].id + '">' + fields[i].name + '</option>';
      }
      html += '<option value="">Other/Undefined</option>'
      document.getElementById('field-filter').innerHTML = html;
      // Lookup object for fields
      for (var i = 0, len = fields.length; i < len; i++) {
        fieldsLookup[fields[i].id] = fields[i];
      }
    }
  };
  xhttp.open("GET", "/api/globalcouncil/fields", true);
  xhttp.setRequestHeader("Authorization", "Basic " + btoa("globalcouncil:GC_map_2018"));
  xhttp.send();
}

// Get Countries
function getCountries() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Save server response
      countries = JSON.parse(xhttp.responseText);
      // Process country names
      for (var i = 0; i < countries.length; i++) {
        countries[i] = countries[i].replace('danemark','denmark').replace('-union','').replace('usa','united-states').replace('_',' ').replace('-',' ');
      }
      // Update countries list
      var html = '<option value="">-- Any country --</option>';
      var length = countries.length;
      for (var i = 0; i < length; i++) {
        html += '<option value="' + countries[i] + '">' + countries[i] + '</option>';
      }
      document.getElementById('country-filter').innerHTML = html;
    }
  };
  xhttp.open("GET", "/api/globalcouncil/locations", true);
  xhttp.setRequestHeader("Authorization", "Basic " + btoa("globalcouncil:GC_map_2018"));
  xhttp.send();
}

// Set markers
function setMarkers(map) {
  // Define icon options
  var jepin = {
    size: new google.maps.Size(50, 88),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 41),
    scaledSize: new google.maps.Size(25, 44),
    url: '/assets/maps/jepin.png'
  }
  var confpin = {
    size: new google.maps.Size(50, 88),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 41),
    scaledSize: new google.maps.Size(25, 44),
    url: '/assets/maps/confpin.png'
  }
  // Load database from server
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Save server response
      mapdb = JSON.parse(xhttp.responseText);
      // Set JE markers
      for (var i = 0; i < mapdb.length; i++) {
        // Process country names
        mapdb[i].country = mapdb[i].country.replace('danemark','denmark').replace('-union','').replace('usa','united-states').replace('_',' ').replace('-',' ');
        // Get JE
        var je = mapdb[i];
        // Pick pin type
        if (je.confederation == 0) {
          var pin = jepin;
        } else {
          var pin = confpin;
        }
        // Create Marker
        jemarkers[i] = new google.maps.Marker({
          position: {lat: +je.latitude, lng: +je.longitude},
          icon: pin,
          title: je.name,
          id: je.id,
          map: map
        });
        // Make marker clickable
        google.maps.event.addListener(jemarkers[i], 'click', function () {
          openInfo(this.id);
        });
      }
    }
  };
  xhttp.open("GET", "/api/globalcouncil/map", true);
  xhttp.setRequestHeader("Authorization", "Basic " + btoa("globalcouncil:GC_map_2018"));
  xhttp.send();
}

function openSearchPanel() {
  document.getElementById('search-panel').style.display = 'block';
  document.getElementById('clearSearch-btn').style.display = 'block';
  document.getElementById('searchIcon').style.display = 'none';
  document.getElementById('search-results').style.display = 'none';
  document.getElementById("search-box").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) { runSearch(); }
  });
}

function clearSearch() {
  document.getElementById('search-panel').style.display = 'none';
  document.getElementById('clearSearch-btn').style.display = 'none';
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('searchIcon').style.display = 'block';
  document.getElementById('search-box').blur();
  document.getElementById('search-box').value = '';
  document.getElementById('field-filter').value = '';
  document.getElementById('field-filter').style.background = '#f2f2f2';
  document.getElementById('country-filter').value = '';
  document.getElementById('country-filter').style.background = '#f2f2f2';
  document.getElementById('type-je').checked = true;
  document.getElementById('type-conf').checked = false;
  for (i in searchmarkers) {
    searchmarkers[i].setMap(null);
  }
  searchmarkers.length = 0;
  showMarkers();
}

function closePanels() {
  document.getElementById('search-panel').style.display = 'none';
  hideResults();
  document.getElementById('search-box').blur();
  var resultsDisplay = document.getElementById('search-results').style.display;
  var searchInput = document.getElementById('search-box').value;
  if (resultsDisplay != 'block' && searchInput == '') {
    document.getElementById('clearSearch-btn').style.display = 'none';
    document.getElementById('searchIcon').style.display = 'block';
  }
}

function runSearch() {
  // Show only "Show results" button
  document.getElementById('search-panel').style.display = 'none';
  document.getElementById('search-box').blur();
  document.getElementById('search-results').style.display = 'block';
  hideResults();
  // Delete old results
  for (i in searchmarkers) {
    searchmarkers[i].setMap(null);
  }
  searchmarkers.length = 0;
  // Get filter values
  var country = document.getElementById('country-filter').value;
  var field = document.getElementById('field-filter').value;
  if (document.getElementById('type-je').checked) {
    var listJEs = true;
  } else {
    var listJEs = false;
  }
  if (document.getElementById('type-conf').checked) {
    var listConfs = true;
  } else {
    var listConfs = false;
  }
  // Add JEs that satisfy filters to a shortlist
  var shortlist = [];
  for (var i = 0; i < mapdb.length; i++) {
    if ((mapdb[i].confederation == 0 && listJEs)||(mapdb[i].confederation == 1 && listConfs)) {
      if (country == '' || mapdb[i].country == country) {
        if (field == '') {
          shortlist.push(mapdb[i]);
          console.log(mapdb[i]);
        } else {
          var l = mapdb[i].fields_id.length;
          for (var j = 0; j < l; j++) {
            if (mapdb[i].fields_id[j] == field) {
              shortlist.push(mapdb[i]);
              console.log(mapdb[i]);
            }
          }
        }
      }
    }
  }
  console.log(shortlist);
  // Run search using fuse.js as long as search-box is not empty
  var query = document.getElementById('search-box').value;
  if (query != '') {
    var options = {
      shouldSort: true,
      tokenize: true,
      threshold: 0,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name"
      ]
    };
    var fuse = new Fuse(shortlist, options);
    var result = fuse.search(query);
  } else {
  // Randomize list if search-box is empty
    function NaiveShuffle(arr) {
      var i, temp, j, len = arr.length;
      var q = len / 5;
      for (i = 0; i < q; i++) {
        j = ~~(Math.random() * len);
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }
    var result = NaiveShuffle(shortlist);
  }
  console.log(result);
  // Count results
  if (result.length == 1) {
    var text = ' JE found'
  } else {
    var text = ' JEs found'
  }
  document.getElementById('counter').innerHTML = result.length + text;
  document.getElementById('counter2').innerHTML = result.length + text;
  // Fill html object with results
  var resultsHTML = result.map(function(je) {
    // Name
    var h = '<button class="result-container" onclick="openInfo(&quot;' + je.id + '&quot;)"><div class="result">' +
              '<div class="je-name">' + je.name + '</div>';
    // Field and Country
    if (je.confederation == 1) {
      var f = 'Confederation';
    } else {
      var f = '';
      var le = je.fields_id.length;
      console.log(le);
      for (var i = 0; i < le; i++) {
        if (je.field_id[i] != null) {
          f += fieldsLookup[je.field_id[i]].name + ' &bull; ';
          console.log(je.field_id[i].name);
        }
      }
      f = f.slice(0, -8);
      console.log(f);
    }
    h +=      '<div style="clear:both;"></div>' +
              '<div class="je-field">' + f + '</div>' +
              '<div class="je-country">' + je.country + '</div>' +
            '</div></button>';
    return h;
  }).join('');
  // Insert html
  document.getElementById('search-results-panel').innerHTML = resultsHTML;
  // Replace markers
  hideMarkers();
  var jepin = {
    size: new google.maps.Size(50, 88),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 41),
    scaledSize: new google.maps.Size(25, 44),
    url: '/assets/maps/jepin.png'
  }
  var confpin = {
    size: new google.maps.Size(50, 88),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 41),
    scaledSize: new google.maps.Size(25, 44),
    url: '/assets/maps/confpin.png'
  }
  if (result.length != 0) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < result.length; i++) {
      var je = result[i];
      if (je.confederation == 0) {
        var pin = jepin;
      } else {
        var pin = confpin;
      }
      var myLatLng = new google.maps.LatLng(je.latitude, je.longitude);
      searchmarkers[i] = new google.maps.Marker({
        position: myLatLng,
        icon: pin,
        title: je.name,
        id: je.id,
        map: map
      });
      google.maps.event.addListener(searchmarkers[i], 'click', function () {
        openInfo(this.id);
      });
      bounds.extend(myLatLng);
    }
    if (result.length == 1) {
      var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
      var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
    }
    map.fitBounds(bounds);
  }
}

function seeResults() {
  document.getElementById('see-btn').style.display = 'none';
  document.getElementById('hide-btn').style.display = 'block';
  document.getElementById('search-results-panel').style.display = 'block';
}

function hideResults() {
  document.getElementById('see-btn').style.display = 'block';
  document.getElementById('hide-btn').style.display = 'none';
  document.getElementById('search-results-panel').style.display = 'none';
  if (searchmarkers.length != 0) {
    document.getElementById('search-results').style.display = 'block';
  }
}

function hideMarkers() {
  for (i in jemarkers) {
    jemarkers[i].setMap(null);
  }
}

function showMarkers() {
  for (i in jemarkers) {
    jemarkers[i].setMap(map);
  }
}

function openInfo(je) {
  // Compress Map
  document.getElementById('search').className += " compressed";
  document.getElementById('map').className += " compressed";
  google.maps.event.trigger(map, 'resize')
  // Get JE info
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      jeinfo = JSON.parse(xhttp.responseText);
      // Cover and Logo
      document.getElementById('je-cover').style.backgroundImage = "url(https://junior-connect.com/storage/" + jeinfo.bg + ")";
      document.getElementById('je-logo').style.backgroundImage = "url(https://junior-connect.com/storage/" + jeinfo.logo + ")";
      // Name
      document.getElementById('je-name').innerHTML = jeinfo.name;
      // Location
      if (jeinfo.country == 'usa') {
        jeinfo.country = "USA";
      }
      document.getElementById('je-location').innerHTML = jeinfo.city + ' – ' + jeinfo.country;
      // Universities
      if (jeinfo.universities.length != 0) {
        document.getElementById('je-uni').innerHTML = jeinfo.universities[0];
        if (jeinfo.universities.length == 1) {
          document.getElementById('uni-subtitle').innerHTML = 'UNIVERSITY';
        } else {
          document.getElementById('uni-subtitle').innerHTML = 'UNIVERSITIES';
          for (var i = 1; i < jeinfo.universities.length; i++) {
            document.getElementById('je-uni').innerHTML += '<br>' + jeinfo.universities[i];
          }
        }
      } else {
        document.getElementById('uni-subtitle').innerHTML = '';
        document.getElementById('je-uni').innerHTML = '';
      }
      // Field
      if (jeinfo.field != null) {
        document.getElementById('field-subtitle').innerHTML = 'FIELD';
      } else {
        document.getElementById('field-subtitle').innerHTML = '';
      }
      document.getElementById('je-field').innerHTML = jeinfo.field;
      // Parent
      if (jeinfo.confederation != null) {
        document.getElementById('parent-subtitle').innerHTML = 'PARENT';
      } else {
        document.getElementById('field-subtitle').innerHTML = '';
      }
      document.getElementById('je-parent').innerHTML = jeinfo.confederation;
      // Placeholder awards
      // FIX THIS LATER
      // if (je.awards != [0,0,0]) {
        document.getElementById('awards-subtitle').innerHTML = 'RECOGNITION';
        var h = '';
        // if (je.awards[0] == 1) {
          var jecountry = jeinfo.country;
          h += '<i class="fa fa-trophy"></i><span>Best JE in Europe of 2018</span>';
        // }
        // if (je.awards[0] == 1) {
          h += '<i class="fa fa-signal"></i><span>High-growth JE in 2017</span>';
        // }
        // if (je.awards[0] == 1) {
          h += '<i class="fa fa-certificate"></i><span><a href="http://jadenet.org/blog">Success story in confederation blog</a></span>';
        // }
        document.getElementById('je-awards').innerHTML = h;
      // } else {
      //   document.getElementById('awards-subtitle').innerHTML = '';
      // }
      // FIX THIS LATER
      // Placeholder stats
      document.getElementById('stats-subtitle').innerHTML = 'STATS';
      document.getElementById('je-stats').innerHTML = '<div class="stats-container"><div class="child"><div class="stat">35</div><div class="description">Members</div></div><div class="child"><div class="stat">177</div><div class="description">Projects in 2017</div></div><div class="child"><div class="stat">375k€</div><div class="description">Revenue in 2017</div></div></div>';
      // Placeholder services
      jeinfo["service1"] = 'Web, Systems and App Development';
      jeinfo["service1img"] = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=75&fm=jpg&w=400&fit=max';
      jeinfo["service2"] = 'Professional Translations';
      jeinfo["service2img"] = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=75&fm=jpg&w=400&fit=max';
      jeinfo["link"] = 'https://je.epfl.ch/';
      // Services
      if (jeinfo.service1 != "" || jeinfo.service2 != "") {
        document.getElementById('services-subtitle').innerHTML = 'MAIN SERVICES';
        var services = '';
        if (jeinfo.service1 != "") {
          services += '<div class="card"><div class="card-image" style="background: url(' + jeinfo.service1img + ')"></div><div class="container"><h4>' + jeinfo.service1 + '</h4></div></div>';
        }
        if (jeinfo.service2 != "") {
          services += '<div class="card"><div class="card-image" style="background: url(' + jeinfo.service2img + ')"></div><div class="container"><h4>' + jeinfo.service2 + '</h4></div></div>';
        }
        if (jeinfo.link != "") {
          services += '<a href="' + jeinfo.link + '" class="hire-btn">Hire this JE</a>'
        }
        document.getElementById('je-services').innerHTML = services;
      }
      // Contact
      var hascontact = false;
      var contact = '<div class="card contact-card">';
      if (jeinfo.website != null) {
        contact += '<a href="' + jeinfo.website + '"><i class="fa fa-globe"></i></a>';
        hascontact = true;
      }
      if (jeinfo.phone != null) {
        contact += '<a href=tel:"' + jeinfo.phone.replace(/\s+/g, '-') + '" class="ttipx"><i class="fa fa-phone"></i><div class="tooltiptext">' + jeinfo.phone + '</div></a>'
        hascontact = true;
      }
      if (jeinfo.email != null) {
        contact += '<a href=mailto:"' + jeinfo.email + '" class="ttipx"><i class="fa fa-envelope"></i><div class="tooltiptext">' + jeinfo.email + '</div></a>'
        hascontact = true;
      }
      contact += '</div>';
      if (hascontact == true) {
        document.getElementById('contact-subtitle').innerHTML = 'CONTACT';
        document.getElementById('je-contact').innerHTML = contact;
      } else {
        document.getElementById('contact-subtitle').innerHTML = '';
        document.getElementById('je-contact').innerHTML = '';
      }
      // Social Media
      var hassocial = false;
      var social = '<div class="card contact-card">';
      if (jeinfo.facebook != null) {
        social += '<a href="' + jeinfo.facebook + '"><i class="fab fa-facebook"></i></a>'
        hassocial = true;
      }
      if (jeinfo.instagram != null) {
        social += '<a href="' + jeinfo.instagram + '"><i class="fab fa-instagram"></i></a>'
        hassocial = true;
      }
      if (jeinfo.linkedin != null) {
        social += '<a href="' + jeinfo.linkedin + '"><i class="fab fa-linkedin"></i></a>'
        hassocial = true;
      }
      social += '</div>';
      if (hassocial == true) {
        document.getElementById('social-subtitle').innerHTML = 'SOCIAL';
        document.getElementById('je-social').innerHTML = social;
      } else {
        document.getElementById('social-subtitle').innerHTML = '';
        document.getElementById('je-social').innerHTML = '';
      }
      // Placeholder Benchmarking CONTACT
      jeinfo["hasbench"] = 1;
      jeinfo["benchname"] = 'John Doe';
      jeinfo["benchposition"] = 'President';
      jeinfo["benchwpp"] = '+000000000000';
      jeinfo["benchmess"] = 'doe.john.doe';
      // Benchmarking Contact
      if (jeinfo.hasbench == 1) {
        var bench = '<h3 class="je-subtitle ttip">BENCHMARKING CONTACT<div class="tooltiptext">Use this contact if you&apos;re a Junior Entrepreneur that wants to contact this JE to exchange ideas, practices and knowledge!</div></h3><div class="bench-contact">';
        if (jeinfo.benchname != "") {
          bench += '<div class="child-60"><div class="contact-name">' + jeinfo.benchname + '</div>'
        }
        if (jeinfo.benchposition != "") {
          bench += '<div class="contact-position">' + jeinfo.benchposition + '</div></div>'
        }
        bench += '<div class="child-40"><div class="card contact-card">'
        if (jeinfo.benchwpp != "") {
          bench += '<a href="https://api.whatsapp.com/send?phone=' + jeinfo.benchwpp + '" class="ttipx"><i class="fab fa-whatsapp"></i><div class="tooltiptext">' + jeinfo.benchwpp + '</div></a>'
        }
        if (jeinfo.benchmess != "") {
          bench += '<a href="https://m.me/' + jeinfo.benchmess + '"><i class="fab fa-facebook-messenger"></i></a>'
        }
        bench += '</div></div></div>';
        document.getElementById('je-benchmarking-contact').innerHTML = bench;
      }
    }
  };
  console.log(je);
  xhttp.open("GET", "/api/globalcouncil/" + je, true);
  xhttp.setRequestHeader("Authorization", "Basic " + btoa("globalcouncil:GC_map_2018"));
  xhttp.send();
  // Display info
  document.getElementById('je-info').style.display = 'block';
  document.getElementById('je-info').scrollTop = 0;
  document.getElementById('search').className += " mobile-hidden";
  hideResults();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < jemarkers.length; i++) {
    if (jemarkers[i].id == je) {
      bounds.extend(jemarkers[i].position);
    }
  }
  var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.01, bounds.getNorthEast().lng() + 0.01);
  var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.01, bounds.getNorthEast().lng() - 0.01);
  bounds.extend(extendPoint1);
  bounds.extend(extendPoint2);
  map.fitBounds(bounds);
}

function closeInfo() {
  var bounds = map.getBounds();
  document.getElementById('search').className = document.getElementById('search').className.replace( /compressed/g , '' );
  document.getElementById('map').className = document.getElementById('map').className.replace( /compressed/g , '' );
  google.maps.event.trigger(map, 'resize')
  map.fitBounds(bounds);
  document.getElementById('je-info').style.display = 'none';
  document.getElementById('search').className = document.getElementById('search').className.replace( /mobile-hidden/g , '' );
}

function colorNav() {
  var color = document.getElementById('je-info-nav').style.background;
  var scroll = document.getElementById('je-info').scrollTop;
  if (color != 'rgb(36, 161, 200)') {
    if (scroll > 136) {
      document.getElementById('je-info-nav').style.background = '#24a1c8';
      document.getElementById('je-info-nav').style.borderBottom = '6px solid #1f8cad';
    }
  } else {
    if (scroll <= 136) {
      document.getElementById('je-info-nav').style.background = 'linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1))';
      document.getElementById('je-info-nav').style.borderBottom = 'none';
    }
  }
}

function colorIfSelected(object) {
  if (object.value != '') {
    object.style.background = '#fff7dd';
  } else {
    object.style.background = '#f2f2f2'
  };
}
