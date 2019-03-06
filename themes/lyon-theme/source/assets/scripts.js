function openDropdown(event, id) {
  // IMPROVE THIS
  if (event.keyCode == 13 || event.which == 13) {
    if (document.getElementById(id).style.display == 'none'){
      document.getElementById(id).style.display = 'block';
    } else {
      document.getElementById(id).style.display = 'none';
    }
  }
}

function smoothScroll(id) {
  var element = document.getElementById(id);
  element.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"});
}

function openVideoModal(videoId,maxWidth,reqHeight) {
  var modal = document.getElementById('video-modal');
  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '<iframe id="modal-iframe" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjeglobalcouncil%2Fvideos%2F' + videoId + '%2F&show_text=0" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
  var modalIframe = document.getElementById('modal-iframe');
  modalIframe.style.maxWidth = maxWidth;
  modalIframe.style.width = '100%';
  modalIframe.style.height = reqHeight;
  modal.style.display = 'block';
  document.getElementById('video-modal-tab-anchor').focus();
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
}

function openFormModal(form) {
  var modal = document.getElementById(form);
  modal.style.display = 'block';
  document.getElementById(form+'-tab-anchor').focus();
}

function closeModal(modal) {
  document.getElementById(modal).style.display = 'none';
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
//  Typewriter effect  //
// ------------------- //

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = this.txt;

  var that = this;
  var delta = 150 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  bubbleGraph();
  var elements = document.getElementsByClassName('typewriter');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
};

// -------------------- //
//     Bubble Graph     //
// -------------------- //

function bubbleGraph() {
  // var bubbleData = process.env.home_page_map_db
  var ctx = document.getElementById('bubbleChart').getContext('2d');
  var bubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: bubbleData
      },
      options: {
        legend: false,
        aspectRatio: 2,
        scales: {
          yAxes: [{
            display: false,
            ticks: {
                min: -90,
                max: 90
            }
          }],
          xAxes: [{
            display: false,
            ticks: {
                min: -175,
                max: 195
            }
          }]
        },
        elements: {
				  point: {
            backgroundColor: 'rgba(36,161,200,0.3)',
            borderColor: 'rgba(36,161,200,0.6)'
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label;
            }
          }
        }
      }
  });
};
