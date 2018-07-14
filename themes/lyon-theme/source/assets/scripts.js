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
  element.scrollIntoView({ behavior:'smooth' });
}

function openModal(videoId,maxWidth,reqHeight) {
  var modal = document.getElementById('modal');
  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '<iframe id="modal-iframe" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjeglobalcouncil%2Fvideos%2F' + videoId + '%2F&show_text=0" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';
  var modalIframe = document.getElementById('modal-iframe');
  modalIframe.style.maxWidth = maxWidth;
  modalIframe.style.width = '100%';
  modalIframe.style.height = reqHeight;
  modal.style.display = 'block';
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
}

function closeModal() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
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
  var elements = document.getElementsByClassName('typewriter');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  bubbleGraph();
};

// -------------------- //
//     Bubble Graph     //
// -------------------- //

function bubbleGraph() {
  var bubbleData = [{"label":"Belgium: 16 JEs","data":[{"r":10,"x":3.5,"y":57.5}]},{"label":"Austria: 5 JEs","data":[{"r":7,"x":11.9,"y":53.1}]},{"label":"Brazil: 605 JEs","data":[{"r":18,"x":-54.7,"y":-11.3}]},{"label":"Morocco: 11 JEs","data":[{"r":9,"x":-5.8,"y":35.2}]},{"label":"Germany: 33 JEs","data":[{"r":12,"x":7.8,"y":57.5}]},{"label":"France: 184 JEs","data":[{"r":16,"x":1.8,"y":52}]},{"label":"Spain: 34 JEs","data":[{"r":12,"x":-3.7,"y":45.3}]},{"label":"USA: 9 JEs","data":[{"r":8,"x":-89.4,"y":43}]},{"label":"Argentina: 4 JEs","data":[{"r":6,"x":-60.3,"y":-38.5}]},{"label":"Chile: 3 JEs","data":[{"r":6,"x":-68.2,"y":-34}]},{"label":"Portugal: 15 JEs","data":[{"r":10,"x":-7.4,"y":45.3}]},{"label":"Romania: 5 JEs","data":[{"r":7,"x":22.4,"y":52}]},{"label":"Canada: 9 JEs","data":[{"r":8,"x":-75.9,"y":57.1}]},{"label":"Tunisia: 39 JEs","data":[{"r":12,"x":8.5,"y":38.5}]},{"label":"Poland: 4 JEs","data":[{"r":6,"x":17.4,"y":58.5}]},{"label":"Cameroon: 9 JEs","data":[{"r":8,"x":12,"y":6.8}]},{"label":"Ecuador: 1 JE","data":[{"r":3,"x":-77.5,"y":-2.3}]},{"label":"Switzerland: 13 JEs","data":[{"r":9,"x":7.2,"y":53.1}]},{"label":"Sweden: 2 JEs","data":[{"r":5,"x":12,"y":69.1}]},{"label":"Colombia: 1 JE","data":[{"r":3,"x":-71.9,"y":4.5}]},{"label":"Denmark: 1 JE","data":[{"r":3,"x":8.4,"y":62.9}]},{"label":"Italy: 18 JEs","data":[{"r":10,"x":11.5,"y":48.6}]},{"label":"England: 2 JEs","data":[{"r":5,"x":-1.7,"y":60.7}]},{"label":"Croatia: 1 JE","data":[{"r":3,"x":13.9,"y":50.9}]},{"label":"South Africa: 3 JEs","data":[{"r":6,"x":23,"y":-32.8}]},{"label":"Kenya: 1 JE","data":[{"r":3,"x":38,"y":1.1}]},{"label":"Netherlands: 13 JEs","data":[{"r":9,"x":4.8,"y":59.6}]},{"label":"Vietnam: 1 JE","data":[{"r":3,"x":104.9,"y":18.1}]}];
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
