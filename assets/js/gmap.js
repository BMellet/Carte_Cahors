$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  getDataJson();

});
var map;
var MapBounds;
var Markers=[];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:44.4581259, lng:  1.4387865},
      zoom: 14,
      minZoom:12,
      fullScreenControl: false,
    });
    MapBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(44.60904581939581,1.7481994628906252),
        new google.maps.LatLng(44.30714395830852,1.1295318603515627));
}
//restrict map viewable area //

map.addListener(map, 'dragend', function ()
{
   
        if (MapBounds.contains(map.getCenter()))
        {
            return;
        }
        else
        {
            map.setCenter(new google.maps.LatLng(44.4581259,1.4387865));
        }
});



function getDataJson() {
  $.ajax({
      dataType: "json",
      url: "dist/js/places.json",
      success: function success(resultat, status) {
          GetInfoCategory(resultat);
      },
      error: function error(resultat, status, _error) {
          console.log(_error);
      },
      complete: function complete(resultat, status) {
          // console.log(status);

      }
  });
}
function GetInfoCategory(data) {
    var nav = document.getElementById("coll-nav");

    data.forEach(function (element) {

        var elem = document.createElement("li");
        elem.style.backgroundColor = element.color;
        elem.style.color = "#FFF";
        var name = document.createElement("div");
        var sub = document.createElement("ul");
        sub.id = element.name;
        name.classList.add("collapsible-header");
        sub.classList.add("collapsible-body");
        name.innerHTML = element.name;
        elem.appendChild(name);
        elem.appendChild(sub);
        nav.appendChild(elem);
        GetSubCategory(element);
    });
}

function GetSubCategory(Parent) {
    Parent.children.forEach(function (element) {
        var relatif = document.getElementById(Parent.name);

        var subCat = document.createElement("li");

        var link = document.createElement("a");
        link.setAttribute("visible", "false");

        var name = document.createElement("p");
        name.innerHTML = element.name;

        var icon = createIcon(element);
        subCat.id = element.name;

        link.appendChild(icon);
        link.appendChild(name);
        subCat.appendChild(link);
        relatif.appendChild(subCat);

        initMarkers(element.places,element,Parent);

        link.addEventListener('click', function () {
            if (link.getAttribute("visible") === "false") {
                link.setAttribute("visible", "true");
            } else {
                link.setAttribute("visible", "false");
            }
            setPlacesFromSelectedSub(link, element, Parent);
        });
    });
}
function initMarkers(places,sub,parent)
{
    var color = parent.color;
    places.forEach(item => {
        var markIcon = {
            path: "M242.606,0C142.124,0,60.651,81.473,60.651,181.955c0,40.928,13.504,78.659,36.31,109.075l145.646,194.183L388.252,291.03   c22.808-30.416,36.31-68.146,36.31-109.075C424.562,81.473,343.089,0,242.606,0z M242.606,303.257   c-66.989,0-121.302-54.311-121.302-121.302c0-66.989,54.313-121.304,121.302-121.304c66.991,0,121.302,54.315,121.302,121.304   C363.908,248.947,309.598,303.257,242.606,303.257z",
            fillColor: color,
            fillOpacity:1,
            fill:color,
            anchor: new google.maps.Point(242.6065,485.212),
            strokeWeight: 0,
            scale: 0.1,

        }

        var lat = item.lat;
        var long = item.lon;
        var marker = new google.maps.Marker({position: {lat:lat,lng:long},
                                             map: null,
                                             animation: google.maps.Animation.DROP,
                                             icon:markIcon,
        });
        var infowindow = new google.maps.InfoWindow({
            content: '<div class="infoWindow">'
                     +'<h5>'+item.name+'</h5>'
                     +'<h6>'+item.description+'</h6>'
                     +'</div>'
          });
  
        marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
  

        Markers.push([marker,item.id]);

    });

}

function setPlacesFromSelectedSub(anchor, sub, parent) {
    var status = anchor.getAttribute("visible");
    if (status === "true") {
        anchor.style.backgroundColor = parent.color;
        anchor.style.color = "white";
        addMarker(sub, parent);
    } else {
        anchor.style.backgroundColor = "";
        anchor.style.color = "#272727";
        removeMarker(sub, parent);
    }
}


function addMarker(sub, parent) {
    var toAdd = [];
    var enfant = sub.places;
    enfant.forEach(function (elem) {
        toAdd.push(elem.id);
    });
    sub.places.forEach(function (element) {
        Markers.forEach(function (element) {
            toAdd.forEach(function (idElem) {
                if (idElem === element[1]) {
                    element[0].setMap(map);
                    element[0].setAnimation(google.maps.Animation.DROP);
                    
                }
            });
        }); 
    });

}

function removeMarker(sub, parent) {

    var toRemove = [];
    var enfant = sub.places;
    enfant.forEach(function (elem) {
        toRemove.push(elem.id);
    });
    Markers.forEach(function (element) {
        toRemove.forEach(function (idElem) {
            if (idElem === element[1]) {
                element[0].setMap(null);
                
            }
        });
    });
    
}

function createIcon(sub) {
    var icon = document.createElement('img');
    icon.setAttribute("class", "sub-icon");
    icon.setAttribute("src", "/dist/img/" + sub.icon);
    return icon;
}