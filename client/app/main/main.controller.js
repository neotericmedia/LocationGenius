'use strict';

angular.module('telusLg2App')
  .controller('MainCtrl', function ($scope, $http, $rootScope, TweeterSearch, TweeterResults, TweetReports, LocationResults, OnsitePregenReport, CarrierPregenReport) {
    var visitorchart;
    var onsiteVisitorChart;


    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var incomeLevelsLabels = ["$0-$39,000", "$40,000-$59,000", "$60,000-$79,000", "$80,000-$99,000", "$100,000-$124,000", "$125,000+"];
    var ethnicitieLabels = {"ABOO":"Aboriginal", "AFRO":"African", "ASIA":"Asian", "SASIA":"South Asian","CARO":"Carribean","EEUO":"Eastern European","LAMO":"Latin American","NEUO":"Northern European","SEUO":"Southern European","WEUO":"Western European"};

    $scope.words = [];

    $scope.update = function() {
      $scope.words.splice(-5);
    };

    // Get the locations from the Location Service
    $http({
      method: 'GET',
      url: '/api/locations',
      // headers: {
      //     'Authorization': 'Basic bGd3ZWI6bGdlbjF1cw==',
      // }
    })
      .success(function (locations) {
        $scope.locations = locations;
      })



    $scope.hourlyData;
    var chart;
    $scope.searchrange = 1000;
    $scope.map = {
      center: {latitude: 43.650505, longitude: -79.383989},
      zoom: 12,
      pan: true,
      //options : {panControl:true, tilt:45},
      //options: {scrollwheel: false, pan: true, panControl: true, tilt: 45, mapTypeId: google.maps.MapTypeId.HYBRID}
      //options: {scrollwheel: false,pan: true, panControl:true, tilt:45, mapTypeId: google.maps.MapTypeId.SATELLITE }
      options: {scrollwheel: false,pan: true, panControl:true, tilt:45}
    };

    $scope.marker = {
      id: 0,
      coords: {
        latitude: 43.650505,
        longitude: -79.383989
      },
      options: {name: "111 Richmond St. Toronto, Ontario", opacity: 0.8}
    };

    $scope.circles = [
      {
        id: 1,
        center: {
          latitude: 43.650505,
          longitude: -79.383989
        },
        radius: 1000,
        stroke: {
          color: '#6ebe44',
          weight: 2,
          opacity: 1
        },
        fill: {
          color: '#6ebe44',
          opacity: 0.1
        },
        geodesic: true, // optional: defaults to false
        draggable: false, // optional: defaults to false
        clickable: false, // optional: defaults to true
        editable: false, // optional: defaults to false
        visible: true, // optional: defaults to true
        control: {}
      }
    ];


    $scope.currentLocation = LocationResults.getCurrentLocation();
    //console.log("CurrentLocation:" + $scope.currentLocation);

   //  $scope.getTabA = function () {
   //    $('.tab-pane:nth-child(1)').hide();
   //    $('.tab-pane:nth-child(2)').hide();
   //    $('.tab-pane:nth-child(0)').fadeIn(800);
   //  }
   //  $scope.getTabB = function () {
   //    $('.tab-pane:nth-child(0)').hide();
   //    $('.tab-pane:nth-child(2)').hide();
   //    $('.tab-pane:nth-child(1)').fadeIn(800);
   //  }
   //  $scope.getTabC = function () {
   //    $('.tab-pane:nth-child(0)').hide();
   //    $('.tab-pane:nth-child(1)').hide();
   //    $('.tab-pane:nth-child(2)').fadeIn(800);
   //  }

    /*************************************************************************************
     *  When a new location is selected, generate the reports and add a marker on the map
     *************************************************************************************/
    $scope.setSelectedLocation = function (location) {
      //console.log("Setting selected location:" + location.name);
      //document.getElementById("contentArea").style.display = "block";
      $('#contentArea').hide();
      $('#contentArea').slideDown(1500);

      //load maps
      //Demographics.initialize();
      //initMap();

      LocationResults.setCurrentLocation(location);
      $scope.currentLocation = LocationResults.getCurrentLocation();
      //console.log("New CurrentLocation:" + $scope.currentLocation);
      //console.log("Location lat:" + $scope.currentLocation.center.latitude);
      //console.log("Location lng:" + $scope.currentLocation.center.longitude);

      //this tells function getReport to function showLast7Days which gets getSocialDayReport. getSocialDayReport tells tweetReports based on location. magic happens in this function.
      $scope.showLast7Days(7);      // Initially we get the last 7 days of data
      $scope.addLocationToMap();
    }


    $scope.showLast7Days = function () {
      //console.log("Last 7 days");
      $scope.getSocialDayReport(7);
      $scope.getCarrierDataPreGenReport(7);
    }


    $scope.addLocationToMap = function () {
      //console.log("Showing selected location...");
      $scope.marker.coords = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };

      $scope.marker.options = {
        name: $scope.currentLocation.name
      };
      $scope.circles[0].radius = $scope.searchrange;
      $scope.map.pan = true;
      $scope.map.center = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };


      //console.log("Setting map Location lat:" + $scope.currentLocation.center.latitude);
      //console.log("Setting map Location lng:" + $scope.currentLocation.center.longitude);

      $scope.circles[0].center = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };


    }


    $scope.setOnsiteDataPreGenReport = function (location) {
      document.getElementById("contentArea").style.display = "block";
      LocationResults.setCurrentLocation(location);
      $scope.currentLocation = LocationResults.getCurrentLocation();
      $scope.getOnsiteDataPreGenReport();
      $scope.addLocationToMap();
    }


    $scope.setCarrierDataPreGenReport = function (location, days) {
      document.getElementById("contentArea").style.display = "block";
      LocationResults.setCurrentLocation(location);
      $scope.currentLocation = LocationResults.getCurrentLocation();
      $scope.getCarrierDataPreGenReport(days);
      $scope.addLocationToMap();
    }


    $scope.getSelectedLocation = function () {
      //console.log("Getting selected location...");
      $scope.currentLocation = LocationResults.getCurrentLocation();
    }


    if ($scope.currentLocation != null) {
      //console.log("Showing selected location..." + $scope.currentLocation.center.latitude);
      //$scope.addLocationToMap();
      $scope.marker.coords = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };

      $scope.marker.options = {
        name: $scope.currentLocation.name
      };
      $scope.circles[0].radius = $scope.searchrange;
      $scope.map.pan = true;
      $scope.map.center = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };
      $scope.circles[0].center = {
        latitude: $scope.currentLocation.center.lat,
        longitude: $scope.currentLocation.center.lon
      };
    }











    $scope.showDailySocialData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      if (window.innerWidth < 984) {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 350,
           colors: ['#6ebe44'],
           chartArea: {left: 40, top: 60, width: '100%'},
           legend: {
             position: 'none',
             textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           format: 'short',
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           hAxis: {title: "Date", format:'MMM d, y', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }}
         };
      }
      else {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 450,
           colors: ['#6ebe44'],
           chartArea: {left: 100, top: 60, width: '100%'},
           legend: {
             position: 'none',
             textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           format: 'short',
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           hAxis: {title: "Date", format:'MMM d, y', slantedText: true, slantedTextAngle: 25, textStyle: {fontName: 'telusweb', fontSize: 12 }}
         };
      }


      chart = new google.visualization.ColumnChart(document.getElementById('barchart_div'));
      chart.draw($scope.data, options);




      if (window.innerWidth < 984) {
        $(window).resize(function(){
           var options = {
             height: 350,
             colors: ['#6ebe44'],

             chartArea: {left: 40, top: 60, width: '100%'},
             legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             format: 'short',
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             hAxis: {title: "Date", format:'MMM d, y', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }}
            };
           chart.draw($scope.data, options);
        });
      }
      else {
        $(window).resize(function(){
           var options = {
             height: 450,
             colors: ['#6ebe44'],
             chartArea: {left: 100, top: 60, width: '100%'},
             legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             format: 'short',
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             hAxis: {title: "Date", format:'MMM d, y', slantedText: true, slantedTextAngle: 25, textStyle: {fontName: 'telusweb', fontSize: 12 }}
            };
           chart.draw($scope.data, options);
        });
      }
      // Every time the table fires the "select" event, it should call your
      // selectSocialHandler() function.
      //console.log("Setting handler...");
      google.visualization.events.addListener(chart, 'select', selectSocialHandler);
    }


    function selectSocialHandler(e) {
      var selection = chart.getSelection();
      //console.log("Selection " + selection.length);
      var index;
      var item = selection[0];
      if (item != null) {
        if (item.row != null && item.column != null) {
          index = item.row;
        }
        showDay(index);
        $scope.$apply();
      }
    }




    $scope.showWordData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      if (window.innerWidth < 984) {
        var options = {
          width: document.getElementById("container").clientWidth - 50,
          height: 350,
          colors: ['#6ebe44'],
          chartArea: {left: 140, top: 60, width: '100%'},
          legend: {
            position: 'none',
            textStyle: { fontName: 'telusweb', fontSize: 12 }
          },
          format: 'short',
          fontSize: 11,
          tooltip: { textStyle: { fontName: 'helvetica', fontSize: 12 } },
          vAxis: {format:'#',textStyle: { color:'#49166d', fontName: 'helvetica', fontSize: 24 }} ,
          hAxis: {format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'helvetica', fontSize: 12 }}
        };
      }
      else {
        var options = {
          width: document.getElementById("container").clientWidth - 50,
          height: 1500,
          colors: ['#6ebe44'],
          chartArea: {left: 140, top: 60, width: '80%'},
          legend: {
            position: 'none',
            textStyle: { fontName: 'telusweb', fontSize: 12 }
          },
          format: 'short',
          fontSize: 11,
          tooltip: { textStyle: { fontName: 'helvetica', fontSize: 12 } },
          vAxis: {format:'#',textStyle: { color:'#49166d',fontName: 'helvetica', fontSize: 24 }} ,
          hAxis: {format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'helvetica', fontSize: 12 }}
        };
      }




      // Items are what goes into the graph data.  The first one describes the data
      var item = ['Word', 'Number of Mentions', {role: 'style'}];
      var wordData = [];
      wordData.push(item);
      var word;
      console.log( "Number of words=" + $scope.words.length);
      for(var i=0; i< $scope.words.length;i++ ) {
        if(i==20) {
          break;
        }
        word = $scope.words[i];
        //console.log( "Word=" + word.text + " Freq=" + word.weight);
        item = [word.text, parseInt(word.weight), '#6ebe44'];
        wordData.push(item)
      }

      var wordgraphdata = google.visualization.arrayToDataTable(wordData);

      var wordchart = new google.visualization.BarChart(document.getElementById('wordbarchart_div'));
      wordchart.draw(wordgraphdata, options);


    }

















   var showDay = function (day) {
      //console.log("Day Index:" + day);
      $scope.dayIndex = day;
      if ($scope.tweetReports.dailyReports[$scope.dayIndex] != null) {
         $scope.dailyReportDate = $scope.tweetReports.dailyReports[$scope.dayIndex].day.toLowerCase();
         $scope.showHourlySocialData($scope.dayIndex);
      }
   }


    $scope.showHourlySocialData = function (day) {

      if (window.innerWidth < 984) {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 350,
           colors: ['#6ebe44'],
           legend: {
             position: 'none',
             textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           chartArea: {left: 40, top: 60, width: '95%'},
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           hAxis: {title: "Hours", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }}
         };
      }
      else {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 450,
           colors: ['#6ebe44'],
           legend: {
             position: 'none',
             textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           chartArea: {left: 100, top: 60, width: '88%'},
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           hAxis: {title: "Hours", format:'#', slantedText: true, slantedTextAngle: 25, textStyle: {fontName: 'telusweb', fontSize: 12 }}
         };
      }


      var linechart = new google.visualization.AreaChart(document.getElementById('linechart_div'));
      var hours = $scope.hourlyData[day];
      var hourly = google.visualization.arrayToDataTable(hours);
      linechart.draw(hourly, options);

      if (window.innerWidth < 984) {
        $(window).resize(function(){
           var options = {
             height: 350,
             colors: ['#6ebe44'],
             legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             chartArea: {left: 40, top: 60, width: '95%'},
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             hAxis: {title: "Hours", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }}
           };
           linechart.draw(hourly, options);
        });
      }
      else {
        $(window).resize(function(){
           var options = {
             height: 450,
             colors: ['#6ebe44'],
             legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             chartArea: {left: 100, top: 60, width: '88%'},
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             vAxis: {title: "Number of Engagements", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             hAxis: {title: "Hours", format:'#', slantedText: true, slantedTextAngle: 25, textStyle: {fontName: 'telusweb', fontSize: 12 }}
           };
           linechart.draw(hourly, options);
        });
      }

    }










    $scope.selectOnsiteFilter = function () {
      $scope.onsitefilters = [
        {
          filterId: 1,
          time: 'Last Weeks',
          showOnsiteLast7Days: function () {
            $scope.getOnsiteDataPreGenReportA();
          }
       },
       {
         filterId: 1,
         time: 'Last 4 Weeks',
         showOnsiteLast4Weeks: function () {
            $scope.getOnsiteDataPreGenReportB();
         }
       }
      ];
      $scope.selectedOnsiteIndex = 0;
      $scope.selectOnsite = function (i) {
        $scope.selectedOnsiteIndex = i;
      };
    }




    $scope.selectCarrierFilter = function () {
      $scope.carrierfilters = [
        {
          filterId: 1,
          time: 'Last 30 Days',
          showNetworkLast30Days: function () {
             $scope.getSocialDayReport(30);
          }
      },
      {
         filterId: 1,
         time: 'Last 60 Days',
         showNetworkLast60Days: function () {
            $scope.getSocialDayReport(60);
         }
      },
      {
         filterId: 1,
         time: 'Last 90 Days',
         showNetworkLast90Days: function () {
            $scope.getSocialDayReport(90);
         }
      }
      ];
      $scope.selectedOnsiteIndex = 0;
      $scope.selectOnsite = function (i) {
        $scope.selectedOnsiteIndex = i;
      };
    }









    $scope.selectFilter = function () {
      $scope.filters = [
        {
          filterId: 1,
          time: 'Last Week',
          showLast7Days: function () {
            $scope.getSocialDayReport(7);
          }
        },
        {
          filterId: 2,
          time: 'Last 4 Weeks',
          showLast4Weeks: function () {
            $scope.getSocialDayReport(28);
          }
        },
        {
          filterId: 3,
          time: 'Last 8 Weeks',
          showLast8Weeks: function () {
            $scope.getSocialDayReport(56);
          }
        },
        // {
        //   filterId: 4,
        //   time: 'Last 3 Months',
        //   showLast84days: function () {
        //     $scope.getSocialDayReport(84);
        //   }
        // },
        // {
        //   filterId: 5,
        //   time: 'Last 4 Months',
        //   showLast112days: function () {
        //     $scope.getSocialDayReport(112);
        //   }
        // }
      ];
      $scope.selectedIndex = 0;

      $scope.select = function (i) {
        $scope.selectedIndex = i;
      };

      $scope.selected = function (i) {
        //console.log("Selected 7 days");
        $scope.selectedIndex = 0;
        $scope.getSocialDayReport(7);
      };
    }




    $scope.showLast4Weeks = function () {
      //console.log("Last 4 weeks");
      $scope.getSocialDayReport(28);
    }
    $scope.showLast8Weeks = function () {
      //console.log("Last 8 weeks");
      $scope.getSocialDayReport(56);
    }
    $scope.showLast84days = function () {
      //console.log("Last 8 weeks");
      $scope.getSocialDayReport(84);
    }
    $scope.showLast112days = function () {
      //console.log("Last 8 weeks");
      $scope.getSocialDayReport(112);
    }


    /**
     * getSocialDayReport - generates the social report
     * for the specified number of days.
     * @param numDays
     */
   //  $scope.getSocialDayReport = function (numDays) {
   //    $scope.currentLocation = LocationResults.getCurrentLocation();
   //    //console.log("Getting social day reports for Location:" + $scope.currentLocation);
    //
   //    // Get the Twitter daily report
   //    $scope.tweetReports;
   //    //console.log("Social Location id:" + $scope.currentLocation.buildingId + " NumDays:" + numDays);
   //    var params = {"locationId": $scope.currentLocation.buildingId, "days": numDays};
   //    $scope.results = TweetReports.query(params);
    //
   //    $scope.results.$promise.then(function (results) {
   //      //console.log("Social Report Results:" + results);
   //      $scope.tweetReports = results;
   //      //console.log("Tweet Reports:" + $scope.tweetReports);
   //      LocationResults.setTweetReports($scope.tweetReports);
   //      $rootScope.$broadcast('newReportsEvent', $scope.tweetReports);
   //      $scope.dateRange = getFormattedDataRange($scope.tweetReports.dateRange);
   //      //console.log("Tweet Report date:" + $scope.tweetReports.dateRange);
   //      var wc  = results.wordCloud;
   //      $scope.words = results.wordCloud;
   //      //console.log("Tweet Word Cloud" + $scope.words);
   //      $scope.totalInteractions = $scope.tweetReports.weeklyTweetTotal.toLocaleString();
   //      $scope.highestTweetedDay = $scope.tweetReports.highestTweetedDay;
   //      $scope.topTweeters = $scope.tweetReports.topTweeters;
   //      //console.log("Top Tweeters:" + $scope.topTweeters);
   //      $scope.mostFrequentAuthor = $scope.tweetReports.mostFrequentAuthor;
   //      $scope.highestTweetedHour = $scope.tweetReports.highestTweetedHour;
    //
    //
   //      $scope.hourlyData = [];  // HourlyData contains the hourly totals for each day
   //      var hourData = [];
   //      var hourItem = [];
   //      var dailyData = [];
   //      var day;
   //      var date;
   //      // Items are what goes into the graph data.  The first one describes the data
   //      var item = ['Day', 'Number of Interactions', {role: 'style'}];
   //      dailyData.push(item);
    //
   //      var dailyReports = $scope.tweetReports.dailyReports;
   //      $scope.numberOfdailyReports = dailyReports.length;
    //
   //      /*
   //       * Parse each daily report. We get the total tweets for each day
   //       * as well as the hourly tweets.  This creates data for the top two tabs.
   //       */
   //      for (var i = 0; i < dailyReports.length; i++) {
   //        if (dailyReports[i] != null) {
   //          //console.log("Tweets on " + dailyReports[i].day + ":" + dailyReports[i].tweets);
    //
   //          //console.log("Visits on " + dailyReports[i].dayOfWeek + " " + dailyReports[i].day + ":" + dailyReports[i].total_visit);
   //          //var day = dailyReports[i].day;
    //
   //          //day = dailyReports[i].day.split(" ")[0];
   //          //date = dailyReports[i].day.split(" ")[1];
    //
   //       //   day = dailyReports[i].day.split(" ")[0];
   //       //   date = dailyReports[i].day.split(" ")[1];
   //       //   date = date.substr(date.indexOf('-') + 1);
    //
   //         //// For just a week, we can put the full day name on the graph, otherwise use the shorter date
   //         //if (numDays > 7) {
   //         //  day = day.toLowerCase();
   //         //  day = day.charAt(0).toUpperCase() + day.substr(1);
   //         //} else {
   //         //  day = date;
   //         //}
    //
   //         // Push one days data into the graph data.
    //
    //
   //         var formattedDate = formatDate(dailyReports[i].day);
   //         console.log("Date=" + formattedDate);
   //         item = [formattedDate, dailyReports[i].tweets, '#6ebe44 '];
   //         dailyData.push(item);
    //
    //
   //          // For just a week, we can put the full day name on the graph, otherwise use the shorter date
   //          if (numDays > 7) {
   //            day = day.toLowerCase();
   //            day = day.charAt(0).toUpperCase() + day.substr(1);
   //          } else {
   //            day = date;
   //          }
    //
    //
   //          /*
   //           *  Get the hourly data for that day and push it into a separate array
   //           *  We push an array of 24 hourly totals, for each day in the report.
   //           */
   //          hourData = [];
   //          hourItem = [];
   //          hourItem = ['Time', 'Number of Interactions', {role: 'style'}];
   //          hourData.push(hourItem);
   //          var ampm = "am";
   //          var h = 0;
   //          for (var j = 0; j < 24; j++) {
   //            if (j > 11) {
   //              ampm = "pm";
   //              if (h >= 13) {
   //                h = h - 12;
   //              }
   //            }
   //            hourItem = [h + ampm, dailyReports[i].hourly[j], '#6ebe44'];
   //            hourData.push(hourItem);
   //            h++;
   //          }
   //          $scope.hourlyData.push(hourData);
   //        }
    //
   //      }
   //      $scope.dayIndex = 0;
    //
   //      // This is the date that goes with time breakdown
   //      if ($scope.tweetReports.dailyReports[0] != null) {
   //        $scope.dailyReportDate = $scope.tweetReports.dailyReports[0].day;
   //        formattedDate = $scope.dailyReportDate;
   //      }
    //
    //
   //      // DailyData is the array for graphing total interactions per day
   //      // If there is only one, there is no data, it is just the headers.
   //      if (dailyData.length > 1) {
   //        //console.log("Daily data:" + dailyData);
   //        $scope.data = google.visualization.arrayToDataTable(dailyData);
   //        $scope.showDailySocialData();
   //      }
    //
   //      if ($scope.hourlyData.length > 0) {
   //        //console.log("Hourly data:" + $scope.hourlyData);
   //        $scope.hourly = google.visualization.arrayToDataTable($scope.hourlyData);
   //        $scope.showHourlySocialData(0);
   //      }
    //
    //
   //      $scope.searchString = $scope.currentLocation.address;
   //      $scope.searchStringName = $scope.currentLocation.name;
   //      $scope.dayrange = numDays;
   //      TweeterResults.setTweeters($scope.topTweeters);
   //      $scope.tweeterResults   = $scope.topTweeters;
    //
   //      $scope.showWordData();
    //
   //    })
   //  }


    //formatting social bar chart dates..
    function formatDate(date) {
         var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
         console.log("Formatting Date=" + date);
         var res = date.split(" ");
         var d = res[1];
         res = d.split("-");
         var formattedDate = months[res[1]] + " " + res[2] + ", " + res[0];
         return formattedDate;
      }







      $scope.getSocialDayReport = function (numDays) {
           $scope.currentLocation = LocationResults.getCurrentLocation();
           //console.log("Getting social day reports for Location:" + $scope.currentLocation);

           // Get the Twitter daily report
           $scope.tweetReports;
           //console.log("Social Location id:" + $scope.currentLocation.buildingId + " NumDays:" + numDays);
           var params = {"locationId": $scope.currentLocation.buildingId, "days": numDays};
           $scope.results = TweetReports.query(params);

           $scope.results.$promise.then(function (results) {
             //console.log("Social Report Results:" + results);
             $scope.tweetReports = results;
             //console.log("Tweet Reports:" + $scope.tweetReports);
             LocationResults.setTweetReports($scope.tweetReports);
             $rootScope.$broadcast('newReportsEvent', $scope.tweetReports);
             $scope.dateRange = getFormattedDataRange($scope.tweetReports.dateRange);
             //console.log("Tweet Report date:" + $scope.tweetReports.dateRange);
             var wc  = results.wordCloud;
             $scope.words = results.wordCloud;
             //console.log("Tweet Word Cloud" + $scope.words);
             $scope.totalInteractions = $scope.tweetReports.weeklyTweetTotal.toLocaleString();
             $scope.highestTweetedDay = $scope.tweetReports.highestTweetedDay;
             $scope.topTweeters = $scope.tweetReports.topTweeters;
             //console.log("Top Tweeters:" + $scope.topTweeters);
             $scope.mostFrequentAuthor = $scope.tweetReports.mostFrequentAuthor;
             $scope.highestTweetedHour = $scope.tweetReports.highestTweetedHour;


             $scope.hourlyData = [];  // HourlyData contains the hourly totals for each day
             var hourData = [];
             var hourItem = [];
             var dailyData = [];
             var day;
             var date;
             // Items are what goes into the graph data.  The first one describes the data
             var item = ['Day', 'Number of Interactions', {role: 'style'}];
             dailyData.push(item);

             var dailyReports = $scope.tweetReports.dailyReports;
             $scope.numberOfdailyReports = dailyReports.length;

             /*
              * Parse each daily report. We get the total tweets for each day
              * as well as the hourly tweets.  This creates data for the top two tabs.
              */
             for (var i = 0; i < dailyReports.length; i++) {
               if (dailyReports[i] != null) {
                 //console.log("Tweets on " + dailyReports[i].day + ":" + dailyReports[i].tweets);
                 day = dailyReports[i].day.split(" ")[0];
                 date = dailyReports[i].day.split(" ")[1];
                 date = date.substr(date.indexOf('-') + 1);
                 // For just a week, we can put the full day name on the graph, otherwise use the shorter date
                 if (numDays <= 7) {
                   day = day.toLowerCase();
                   day = day.charAt(0).toUpperCase() + day.substr(1);
                 } else {
                   day = date;
                 }

                 // Push one days data into the graph data.
                 //item = [day, dailyReports[i].tweets, '#6ebe44'];
                 //dailyData.push(item);


                 var formattedDate = formatDate(dailyReports[i].day);
                 console.log("Date=" + formattedDate);
                 item = [formattedDate, dailyReports[i].tweets, '#6ebe44 '];
                 dailyData.push(item);



                 /*
                  *  Get the hourly data for that day and push it into a separate array
                  *  We push an array of 24 hourly totals, for each day in the report.
                  */
                 hourData = [];
                 hourItem = [];
                 hourItem = ['Time', 'Number of Interactions', {role: 'style'}];
                 hourData.push(hourItem);
                 var ampm = "am";
                 var h = 0;
                 for (var j = 0; j < 24; j++) {
                   if (j > 11) {
                     ampm = "pm";
                     if (h >= 13) {
                       h = h - 12;
                     }
                   }
                   hourItem = [h + ampm, dailyReports[i].hourly[j], '#6ebe44'];
                   hourData.push(hourItem);
                   h++;
                 }
                 $scope.hourlyData.push(hourData);
               }

             }
             $scope.dayIndex = 0;

             // This is the date that goes with time breakdown
             if ($scope.tweetReports.dailyReports[0] != null) {
               $scope.dailyReportDate = $scope.tweetReports.dailyReports[0].day;
             }


             // DailyData is the array for graphing total interactions per day
             // If there is only one, there is no data, it is just the headers.
             if (dailyData.length > 1) {
               //console.log("Daily data:" + dailyData);
               $scope.data = google.visualization.arrayToDataTable(dailyData);
               $scope.showDailySocialData();
             }

             if ($scope.hourlyData.length > 0) {
               //console.log("Hourly data:" + $scope.hourlyData);
               $scope.hourly = google.visualization.arrayToDataTable($scope.hourlyData);
               $scope.showHourlySocialData(0);
             }


             $scope.searchString = $scope.currentLocation.address;
             $scope.searchStringName = $scope.currentLocation.name;
             $scope.dayrange = numDays;
             TweeterResults.setTweeters($scope.topTweeters);
             $scope.tweeterResults   = $scope.topTweeters;


             $scope.showWordData();


           })
         }






    function getFormattedDataRange(range) {
      var dates = range.split(":");
      var startDate = dates[0];
      var endDate = dates[1];
      var items = startDate.split("-");
      var startYear = items[0];
      var startMonth = items[1];
      var startDay = items[2];
      var items = endDate.split("-");
      var endYear = items[0];
      var endMonth = items[1];
      var endDay = items[2];
      return months[parseInt(startMonth) - 1] + " " + startDay+ ", " + endYear + " to " + months[parseInt(endMonth) - 1] + " " + endDay + ", " + endYear;

    }


    /**
     * Gets the onsite sensor report for the specified location.
     */
    $scope.getOnsiteDataPreGenReport = function () {
      $scope.currentLocation = LocationResults.getCurrentLocation();
      //console.log("Onsite data CurrentLocation:" + $scope.currentLocation.buildingId);

      $scope.mostVisitedHour = "N/A";
      $scope.mostPostalCode = "N/A";
      $scope.mostVisitsToDate = "N/A";
      $scope.mostCustomer = "N/A";
      $scope.onsiteVisitorsWeek = "N/A";
      $scope.onsiteWeek = "N/A";
      $scope.averageVisitorsDay = "N/A";
      $scope.averageVisitDuration = "N/A";
      $scope.onsiteMostVisitedDay = "N/A";
      $scope.onsiteMostVisitedDayTotal = "N/A";
      $scope.weekChange = "N/A";
      $scope.mostFrequestCustomer = "N/A";
      $scope.mostFrequestCustomerVisits = "N/A";
      $scope.busiestHourDay = "N/A";
      $scope.busiestHour = "N/A";
      $scope.busiestHourVisits = "N/A";

      var dailyVisitorData = [];
      var item = ['Day', 'New Visitors', {role: 'style'}, 'Existing Visitors', {role: 'style'}];
      dailyVisitorData.push(item);

      //console.log("Getting onsite report for :" + $scope.currentLocation.buildingId);


      var dateobj = new Date();
      var month = dateobj.getMonth() + 1;
      var day = dateobj.getDate();
      var year = dateobj.getFullYear();


      var dateString = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

      console.log("Date: " + dateString);
      var params = {"buildingId": $scope.currentLocation.buildingId, "dt": dateString};


      //console.log("Onsite Report params..." + params.buildingId + " " + params.dt);
      $scope.report = OnsitePregenReport.query(params);
      $scope.report.$promise.then(function (results) {
        //console.log("Onsite Report Results:" + results.totalVisits);
        if (results != null) {
          if(results.totalVisits!=null) {
            $scope.onsiteVisitorsWeek = results.totalVisits;
          } else {
            $scope.onsiteVisitorsWeek = "N/A";
          }

          //$scope.onsiteVisitorsWeek.toLocaleString();
          $scope.onsiteWeek = results.weekName;
          $scope.averageVisitorsDay = results.averageVisitorsDay;
          if(results.weekChange!=null) {
            $scope.weekChange = results.weekChange;
          } else {
            $scope.weekChange = "N/A";
          }


          $scope.onsiteMostVisitedDay = results.mostVisitedDay;
          $scope.onsiteMostPostalCode = results.mostPostalCode;
          $scope.onsiteMostVisitedDayTotal = results.mostVisitedDayTotal;
          $scope.averageVisitDuration = results.averageVisitDuration;
          $scope.mostFrequentCustomer = results.mostFrequentCustomer.mac;
          $scope.mostFrequentCustomerVisits = results.mostFrequentCustomer.numVisits;
          $scope.busiestHourDay = results.busiestHour.day;
          $scope.busiestHour = parseInt(results.busiestHour.hour);
          $scope.busiestHourDay = results.busiestHour.day;
          $scope.busiestHourVisits = results.busiestHour.visits;
          $scope.topCustomers = results.topCustomers;
          $scope.topCustomersTotals = results.topCustomers;
          $scope.hourlyBreakdown = results.hourlyBreakdown;
          $scope.durations = results.durations;
          $scope.days = results.days;

          var busyHour = $scope.busiestHour;
          $scope.mostVisitedHour;
          if (busyHour == 12) {
            $scope.mostVisitedHour = "12PM" + " - " + "1PM";
          } else {
            if (busyHour > 12) {
              $scope.mostVisitedHour = (busyHour - 12) + "PM - " + (busyHour - 11) + "PM";
            } else {
              $scope.mostVisitedHour = (busyHour) + "AM - " + (busyHour + 1) + "AM";
            }
          }


          if ($scope.weekChange > 0) {
            $scope.changeImage = "up";
          }
          if ($scope.weekChange < 0) {
            $scope.changeImage = "down";
          }


          if ($scope.weekChange > 0) {
            $scope.changeIcon = "fa fa-angle-up";
          }
          if ($scope.weekChange < 0) {
            $scope.changeIcon = "fa fa-angle-down";
          }


          var dailyReports = results.days;
          var item;

          for (var i = 0; i < dailyReports.length; i++) {
            if (dailyReports[i] != null) {
              //console.log("Visits on " + dailyReports[i].dayOfWeek + " " + dailyReports[i].day + ":" + dailyReports[i].total_visit);
              var date = dailyReports[i].day;
              item = [date, dailyReports[i].newMac, '#6ebe44', dailyReports[i].existing, '#49166d'];
              dailyVisitorData.push(item);
            }
          }

          var hourlyReports = results.hourly_breakdown;
          $scope.hourlyVisitorData = [];
          var hourlyitem = ['Hour', 'Number of Visitors', {role: 'style'}];
          $scope.hourlyVisitorData.push(hourlyitem);

          //var hourlyTotals = results.hourlyBreakdown;
          $scope.onsiteHourlyTotals = results.hourlyData;

          $scope.durations = results.durations;

          $scope.visitordata = google.visualization.arrayToDataTable(dailyVisitorData);
          $scope.showOnsiteDailyVisitorData();
          $scope.showOnsiteHourlyVisitorData(0);
          $scope.showOnsiteDurationData();
          $scope.showOnsiteLoyaltyData();

        }
      })
    }





    $scope.showOnsiteDailyVisitorData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      if (window.innerWidth < 984) {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 350,
           colors: ['#ffffff', '#6ebe44'],
           chartArea: {left: 60, top: 60, width: '94%'},
           legend: {position: 'none'},
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           isStacked: true,
           hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Number of Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
         };
      }
      else {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 450,
           colors: ['#ffffff', '#6ebe44'],
           chartArea: {left: 100, top: 60, width: '94%'},
           legend: {position: 'none'},
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           isStacked: true,
           hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Number of Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
         };
      }


      onsiteVisitorChart = new google.visualization.ColumnChart(document.getElementById('onsite_visitors_barchart_div'));
      onsiteVisitorChart.draw($scope.visitordata, options);


      if (window.innerWidth < 984) {
        $(window).resize(function(){
           var options = {
             width: {width: '100%'},
             height: 350,
             colors: ['#ffffff', '#6ebe44'],
             chartArea: {left: 60, top: 60, width: '94%'},
             legend: {position: 'none'},
             isStacked: true,
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Number of Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
           };
            onsiteVisitorChart.draw($scope.visitordata, options);
        });
      }
      else {
        $(window).resize(function(){
           var options = {
             width: {width: '100%'},
             height: 450,
             colors: ['#ffffff', '#6ebe44'],
             chartArea: {left: 100, top: 60, width: '94%'},
             legend: {position: 'none'},
             isStacked: true,
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Number of Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
           };
            onsiteVisitorChart.draw($scope.visitordata, options);
        });
      }




      // Every time the table fires the "select" event, it should call your
      // select Handler() function.
      google.visualization.events.addListener(onsiteVisitorChart, 'select', selectOnsiteDayHandler);

    }



    $scope.showOnsiteLoyaltyData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 450,
        colors: ['#6ebe44'],
        chartArea: {left: 100, top: 60, width: '94%'},
        legend: {position: 'none'},
        hAxis: {title: "Number of Repeat Visits", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
        vAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
        fontSize: 11,
        tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
      };

      var customers = $scope.topCustomers;

      var loyaltyData = [];
      var loyaltyItem = ['Number of Repeat Visits', 'Number of Repeat Visits',{role: 'style'}];
      loyaltyData.push(loyaltyItem);

      var loyaltyCounts = [];

      //console.log("Customers count " + j + ":" + customers.length);
      var index = 0;
      if (customers != null) {
        for (var j = 0; j < customers.length; j++) {
          //console.log("Loyalty count " + j + ":" + customers[j].numVisits);
          index = parseInt(customers[j].numVisits);
          //console.log("index " + index);
          if (loyaltyCounts[index] === undefined) {
            loyaltyCounts[index] = 1;
          } else {
            loyaltyCounts[index]++;
          }


          //console.log("Loyalty count " + j + ":" + loyaltyCounts[j]);

        }
        for (var j = 0; j < loyaltyCounts.length; j++) {
          //console.log("Count " + j + ":" + loyaltyCounts[j]);
          loyaltyItem = [j,loyaltyCounts[j], '#6ebe44'];
          loyaltyData.push(loyaltyItem);
        }
      }



      var data = google.visualization.arrayToDataTable(loyaltyData);
      var onsiteLoyaltyChart = new google.visualization.ColumnChart(document.getElementById('onsite_loyalty_chart_div'));
      onsiteLoyaltyChart.draw(data, options);

      //  $(window).resize(function(){
      //     onsiteLoyaltyChart.draw(data, options);
      //  });


       if (window.innerWidth < 984) {
         $(window).resize(function(){
            var options = {
              //width: 1075,
              width: {width: '100%'},
              height: 350,
              colors: ['#6ebe44'],
              chartArea: {left: 50, top: 60, width: '94%'},
              legend: {position: 'none'},
              fontSize: 11,
              hAxis: {title: "Number of Repeat Visits", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
            };
            onsiteLoyaltyChart.draw(data, options);
         });
       }
       else {
         $(window).resize(function(){
            var options = {
              //width: 1075,
              width: {width: '100%'},
              height: 450,
              colors: ['#6ebe44'],
              chartArea: {left: 100, top: 60, width: '94%'},
              legend: {position: 'none'},
              fontSize: 11,
              hAxis: {title: "Number of Repeat Visits", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
            };
            onsiteLoyaltyChart.draw(data, options);
         });
       }




    }


    /**
     * Adds a clickable listener to the chart that updates
     * the time breakdown chart on clicking
     * @param e
     */
    function selectOnsiteDayHandler(e) {
      var selection = onsiteVisitorChart.getSelection();
      //console.log("Onsite Selection " + selection.length);
      var index;
      var item = selection[0];
      if (item != null) {
        if (item.row != null && item.column != null) {
          index = item.row;
        }

        showOnsiteDay(index);
        $scope.$apply();
      }
    }

    var showOnsiteDay = function (day) {
      //console.log("Onsite Day Index:" + day);

      $scope.showOnsiteHourlyVisitorData(day);

    }

    $scope.showOnsiteHourlyVisitorData = function (day) {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing hourly data for day " + day);
      if (window.innerWidth < 984) {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 450,
           colors: ['#6ebe44'],
           chartArea: {left: 50, top: 60, width: '90%'},
           legend: {
              position: 'none',
              textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           fontSize: 11,
           hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Number of Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
         };
      }
      else {
         var options = {
           width: document.getElementById("container").clientWidth - 50,
           height: 450,
           colors: ['#6ebe44'],
           chartArea: {left: 100, top: 60, width: '88%'},
           legend: {
              position: 'none',
              textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           fontSize: 11,
           hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Number of Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
         };
      }


      $scope.hourlyVisitorData = [];
      var hourlyitem = ['Hour', 'Number of Visitors', {role: 'style'}];
      $scope.hourlyVisitorData.push(hourlyitem);

      var hourlyTotals = []
      var j=0;
      for(var m in $scope.onsiteHourlyTotals) {
        if(j==day) {
          hourlyTotals = $scope.onsiteHourlyTotals[m];
          break;
        } else {
          j++;
        }
      }

      //console.log("HourlyTotals:" + hourlyTotals);

      var ampm = "am";
      var h = 0;
      for (var i = 0; i < 24; i++) {
        h = i;
        if (i > 11) {
          ampm = "pm";
          if (i >= 13) {
            h = h - 12;
          }
        }
        hourlyitem = [h + ampm, hourlyTotals[i], '#6ebe44'];
        $scope.hourlyVisitorData.push(hourlyitem);
        h++;
      }

      var linechart = new google.visualization.AreaChart(document.getElementById('onsite_timebreakdown_chart_div'));
      //console.log("Graphing ..." + $scope.hourlyVisitorData);
      var hourly = google.visualization.arrayToDataTable($scope.hourlyVisitorData);

      linechart.draw(hourly, options);


       if (window.innerWidth < 984) {
         $(window).resize(function(){
            var options = {
              height: 350,
              colors: ['#6ebe44'],
              chartArea: {left: 60, top: 60, width: '90%'},
              legend: {
                position: 'none',
                textStyle: { fontName: 'telusweb', fontSize: 12 }
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              fontSize: 11,
              hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Number of Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
            };
            linechart.draw(hourly, options);
         });
       }
       else {
         $(window).resize(function(){
            var options = {
              height: 450,
              colors: ['#6ebe44'],
              chartArea: {left: 100, top: 60, width: '88%'},
              legend: {
                position: 'none',
                textStyle: { fontName: 'telusweb', fontSize: 12 }
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              fontSize: 11,
              hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Number of Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
            };
            linechart.draw(hourly, options);
         });
       }



    }





    $scope.showOnsiteDurationData = function () {
      var dwellTimeBuckets = ["0-30", "31-60", "61-90", "91-120", "121-150", "151-180"];

      var durationData = [];
      var otherTotal = 0;
      var durationitem = ['Minutes', 'Number of Visitors in Range', {role: 'style'}];
      durationData.push(durationitem);

      console.log("Number of dwellTimes=" + $scope.durations.length)
      for (var i = 0; i < $scope.durations.length; i++) {

        if(i<=5) {
          console.log("Dwell Time Bucket" + dwellTimeBuckets[i] + " value=" + $scope.durations[i])
          durationitem = [dwellTimeBuckets[i], $scope.durations[i], '#6ebe44'];
        }else {
          console.log("Other value=" + $scope.durations[i])
          otherTotal += $scope.durations[i];
        }
        durationData.push(durationitem);
      }

      if(otherTotal>0) {
        durationitem = ["180+", otherTotal, '#6ebe44'];
        durationData.push(durationitem);
      }



      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing online visitor duration data...");
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 450,
        colors: ['#6ebe44'],
        chartArea: {left: 100, top: 60, width: '100%'},
        legend: {
            position: 'none',
            textStyle: { fontName: 'telusweb', fontSize: 12 }
        },
        hAxis: {title: "Minutes", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
        vAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
        fontSize: 11,
        tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
      };

      var linechart = new google.visualization.ColumnChart(document.getElementById('onsite_visitor_chart_div'));
      //console.log("Graphing ..." + durationData);
      var minutesData = google.visualization.arrayToDataTable(durationData);
      linechart.draw(minutesData, options);



      if (window.innerWidth < 984) {
        $(window).resize(function(){
           var options = {
             height: 350,
             colors: ['#6ebe44'],
             chartArea: {left: 50, top: 60, width: '100%'},
             legend: {
                 position: 'none',
                 textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             fontSize: 11,
             hAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Number of Minutes", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
           };
           linechart.draw(minutesData, options);
        });
      }
      else {
        $(window).resize(function(){
           var options = {
             height: 450,
             colors: ['#6ebe44'],
             chartArea: {left: 100, top: 60, width: '100%'},
             legend: {
                 position: 'none',
                 textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             fontSize: 11,
             hAxis: {title: "Number of Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Number of Minutes", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }},
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } }
           };
           linechart.draw(minutesData, options);
        });
      }




    }




    /**
     * Gets a carrier report for the current location for the specified number of days
     * @param numDays
     */
    $scope.getCarrierDataPreGenReport = function (numDays) {
      $scope.currentLocation = LocationResults.getCurrentLocation();
      var xfactor =  $scope.currentLocation.xfactor;
      //console.log("Location Xfactor:" + xfactor);
      if(xfactor==null) {
        xfactor = 1.0;
      }
      $scope.carrierUniqueVisitors = "N/A";

      var dailyCarrierVisitorData = [];
      var hourlyTotals;
      $scope.carrierHourlyData = [];

      var item = ['Day', 'All Visitors', {role: 'style'}, 'New Visitors', {role: 'style'}];
      dailyCarrierVisitorData.push(item);
      //console.log("Getting carrierreport for :" + $scope.currentLocation.buildingId + " for " + numDays + " days");

      var params = {"locationId": $scope.currentLocation.buildingId, "days": numDays, "endDate": "2014-08-18"};

      $scope.report = CarrierPregenReport.query(params);
      $scope.report.$promise.then(function (results) {

          //console.log("Results = " +  results);
          if (results != null) {
            var reports = results.reports;
            if(reports!=null) {
              reports.reverse();
              $scope.carrierReports = results.reports;
          }
          $scope.carrierUniqueVisitors = 0;
          $scope.carrierAverageVisitorsDay = 0;
          //console.log("Reports = " +  reports);
          // The results come in reverse order
          for (var i = 0; i< reports.length;  i++) {
            //console.log("Carrier UniqueVisitors = " + i + " " + results[i].uniqueVisitors);
            var visitors = Math.round(reports[i].uniqueVisitors * xfactor);
            var newVisitors = Math.round(reports[i].newVisitors * xfactor);
            //console.log("Adjusted Carrier UniqueVisitors = " + i + " " + visitors);
            //console.log("Carrier Date = " + results[i].date);
            $scope.carrierUniqueVisitors = $scope.carrierUniqueVisitors + visitors;

            var d = new Date(reports[i].date);
            //console.log("Date=" + d);
            var res = d.toDateString().split(" ");
            var formattedDate=  res[1] + " " + res[2] + "," + res[3];
            item = [formattedDate, visitors, '#49166d', newVisitors, '#6ebe44'];

            dailyCarrierVisitorData.push(item);

            /*
             *  Get the hourly data for that day and push it into a separate array
             *  We push an array of 24 hourly totals, for each day in the report.
             */
            var hourData = [];
            var hourItem = ['Time', 'Number of Interactions', {role: 'style'}];
            hourData.push(hourItem);
            var ampm = "am";
            var h = 0;
            for (var j = 0; j < 24; j++) {
              if (j > 11) {
                ampm = "pm";
                if (h >= 13) {
                  h = h - 12;
                }
              }
              var hourlyTotal = Math.round(reports[i].hourlyTotals[j] * xfactor);
              hourItem = [h + ampm, hourlyTotal, '#6ebe44'];
              //hourItem = [h + ampm, results[i].hourlyTotals[j], '#6ebe44'];
              hourData.push(hourItem);
              h++;
            }
            $scope.carrierHourlyData.push(hourData);

          } // end for



          // demographic totals
          $scope.demographicReport = results.demographicReport;
          $scope.tiles = results.tiles;

          //console.log("Demographic=" + results.demographicReport);
          $scope.showDemographicData();

          $scope.carrierAverageVisitorsDay = Math.round($scope.carrierUniqueVisitors / reports.length);

          $scope.carriervisitordata = google.visualization.arrayToDataTable(dailyCarrierVisitorData);
          $scope.showCarrierDailyVisitorData();

          if ($scope.carrierHourlyData.length > 0) {
            $scope.showHourlyCarrierVisitorData(reports.length - 1);
          }

          //$scope.carrierDwellTimeData = [];
          //var dwellTimeItem = ['Minutes', 'Number of Visits', {role: 'style'}];
          //$scope.carrierDwellTimeData.push();

          //console.log("Graphing: " + results[0].dwellTimes)
          $scope.showCarrierDwellTimesData(0);



        }
      });
    }



    /**
     * Displays the demographic information for the carrier data
     */
    $scope.showDemographicData = function() {

      if($scope.demographicReport!=null) {
        //console.log("Tiles=" + $scope.tiles.length);
        //console.log("Incomes=" + $scope.demographicReport.incomeCounts);

        $scope.mostPopularEthnicity = ethnicitieLabels[$scope.demographicReport.largestEthnicity];
        $scope.mostPopularIncomeLevel = incomeLevelsLabels[$scope.demographicReport.largestIncomeIndex];

        var totalIncomes = 0;
        for(var i=0;i<$scope.demographicReport.incomeCounts.length;i++) {
          totalIncomes+=$scope.demographicReport.incomeCounts[i];
        }


        var incomeData = [];
        incomeData.push(['Income Level', 'Distribution', {role: 'style'}]);

        var regcolour = '#49166d';
        var maxcolour = '#6ebe44';
        var colour = regcolour;

        for (var i = 0; i < incomeLevelsLabels.length; i++) {
          if (i == $scope.demographicReport.largestIncomeIndex) {
            colour = maxcolour;
          } else {
            colour = regcolour;
          }
          var value = parseFloat(($scope.demographicReport.incomeCounts[i]/totalIncomes).toPrecision(2));

          incomeData.push([incomeLevelsLabels[i], value, colour]);
        }

        var data = google.visualization.arrayToDataTable(incomeData);

        if (window.innerWidth < 984) {
          var options = {
            //width: 1075,
            width: document.getElementById("container").clientWidth - 60,
            height: 340,
            colors: ['#ffffff', '#6ebe44'],
            chartArea: {left: 120, top: 30, width: '100%'},
            legend: {position: 'none'},
            tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
            hAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
             yAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
             }
          };
        }
        else {
          var options = {
            //width: 1075,
            width: document.getElementById("container").clientWidth/2,
            height: 340,
            colors: ['#ffffff', '#6ebe44'],
            chartArea: {left: 120, top: 30, width: '100%'},
            legend: {position: 'none'},
            tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
            hAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
            yAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
            }
          };
        }

        var incomeChart = new google.visualization.BarChart(document.getElementById('demographic_income_chart_div'));
        incomeChart.draw(data, options);

        $scope.showHeatMapData();
        $scope.showVisitorMapData();
        $scope.showEthnicData();

        $(window).resize(function(){
          var options = {
            //width: 1075,
            height: 340,
            colors: ['#ffffff', '#6ebe44'],
            chartArea: {left: 120, top: 30, width: '100%'},
            legend: {position: 'none'}
          };
           incomeChart.draw(data, options);
        });

      }

    }



    /**
     * Displays the demographic information for the carrier data
     */
    $scope.showEthnicData = function() {

      if($scope.demographicReport!=null) {

        var ethnicData = [];
        ethnicData.push(['Ethnicity', 'Distribution', {role: 'style'}]);

        var ethnicTotal = $scope.demographicReport.etABOOCount +
                          $scope.demographicReport.etWEUOCount +
                          $scope.demographicReport.etNEUOCount +
                          $scope.demographicReport.etEEUOCount +
                          $scope.demographicReport.etSEUOCount +
                          $scope.demographicReport.etCAROCount +
                          $scope.demographicReport.etLAMOCount +
                          $scope.demographicReport.etASIACount +
                          $scope.demographicReport.etSACount +
                          $scope.demographicReport.etAFROCount;

        var otherTotal = 0.0;

        if($scope.demographicReport.etABOOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etABOOCount;
        } else {
          ethnicData.push([ethnicitieLabels['ABOO'], $scope.demographicReport.etABOOCount, 'silver']);
        }

        if($scope.demographicReport.etWEUOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etWEUOCount;
        } else {
          ethnicData.push([ethnicitieLabels['WEUO'], $scope.demographicReport.etWEUOCount, 'silver']);
        }

        if($scope.demographicReport.etNEUOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etNEUOCount;
        } else {
          ethnicData.push([ethnicitieLabels['NEUO'], $scope.demographicReport.etNEUOCount, 'silver']);
        }

        if($scope.demographicReport.etEEUOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etEEUOCount;
        } else {
          ethnicData.push([ethnicitieLabels['EEUO'], $scope.demographicReport.etEEUOCount, 'silver']);
        }

        if($scope.demographicReport.etSEUOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etSEUOCount;
        } else {
          ethnicData.push([ethnicitieLabels['SEUO'], $scope.demographicReport.etSEUOCount, 'silver']);
        }

        if($scope.demographicReport.etCAROCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etCAROCount;
        } else {
          ethnicData.push([ethnicitieLabels['CARO'], $scope.demographicReport.etCAROCount, 'silver']);
        }

        if($scope.demographicReport.etLAMOCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etLAMOCount;
        } else {
          ethnicData.push([ethnicitieLabels['LAMO'], $scope.demographicReport.etLAMOCount, 'silver']);
        }

        if($scope.demographicReport.etAFROCount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etAFROCount;
        } else {
          ethnicData.push([ethnicitieLabels['AFRO'], $scope.demographicReport.etAFROCount, 'silver']);
        }

        if($scope.demographicReport.etASIACount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etASIACount;
        } else {
          ethnicData.push([ethnicitieLabels['ASIA'], $scope.demographicReport.etASIACount, 'silver']);
        }

        if($scope.demographicReport.etSACount/ethnicTotal < 0.1) {
          otherTotal += $scope.demographicReport.etSACount;
        } else {
          ethnicData.push([ethnicitieLabels['SASIA'], $scope.demographicReport.etSACount, 'silver']);
        }



        if(otherTotal > 0) {
          ethnicData.push(['Other', otherTotal, 'silver']);
        }

        var data = google.visualization.arrayToDataTable(ethnicData);

        if (window.innerWidth < 984) {
          var options = {
            slices: {
              0: { color: '#6ebe44' },
              1: { color: '#49166d' },
              2: { color: '#b196c1' },
              3: { color: '#8c68a6' },
              4: { color: '#c8bbd0' },
              5: { color: '#c8bbd0' },
              6: { color: '#e0cdf4' },
              7: { color: '#ece7ee' },
              8: { color: '#efcdf4' },
              9: { color: '#fce7ee' }
            },
            width: document.getElementById("container").clientWidth - 60,
            height: 340,
            tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
            chartArea: {left: 0, top: 30, width: '100%'},
            legend: {
                position: 'right',
                textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
            is3D: false,
            hAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
             yAxis: {
              textStyle: { fontName: 'telusweb', fontSize: 12 }
             }
          };
        }
        else {
          var options = {
            slices: {
              0: { color: '#6ebe44' },
              1: { color: '#e0cdf4' },
              2: { color: '#b196c1' },
              3: { color: '#8c68a6' },
              4: { color: '#c8bbd0' },
              5: { color: '#c8bbd0' },
              6: { color: '#e0cdf4' },
              7: { color: '#ece7ee' },
              8: { color: '#efcdf4' },
              9: { color: '#fce7ee' }
            },
            width: document.getElementById("container").clientWidth/2,
            height: 340,
            tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
            chartArea: {left: 0, top: 30, width: '100%'},
            legend: {
                position: 'right',
                textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
            is3D: false,
            hAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             yAxis: {
                textStyle: { fontName: 'telusweb', fontSize: 12 }
             }
          };
        }

         var formatter = new google.visualization.NumberFormat(
         {negativeColor: 'red', negativeParens: true, pattern: '###,###'});
         formatter.format(data, 1);

        var ethnicChart = new google.visualization.PieChart(document.getElementById('demographic_ethnicity_chart_div'));
        ethnicChart.draw(data, options);

        $(window).resize(function(){
          var options = {
            slices: {
              0: { color: '#6ebe44' },
              1: { color: '#49166d' },
              2: { color: '#b196c1' },
              3: { color: '#8c68a6' },
              4: { color: '#c8bbd0' },
              5: { color: '#c8bbd0' },
              6: { color: '#e0cdf4' },
              7: { color: '#ece7ee' },
              8: { color: '#efcdf4' },
              9: { color: '#fce7ee' }
            },
            height: 340,
            tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
            chartArea: {left: 0, top: 30, width: '100%'},
            legend: {
                position: 'right',
                textStyle: { fontName: 'telusweb', fontSize: 12 }
            },
            is3D: false,
            hAxis: {
             textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             yAxis: {
                textStyle: { fontName: 'telusweb', fontSize: 12 }
             }
          };
          ethnicChart.draw(data, options);
        });

      }

    }


    $scope.showHeatMapData = function() {
      if($scope.tiles!=null) {
        //console.log("Tiles=" + $scope.tiles.length);
        var callsForService = [];

        for (var i = 0; i < $scope.tiles.length; i++) {
          //console.log("Tile=" + $scope.tiles[i].centerPoint.lat + " " + $scope.tiles[i].centerPoint.lon);
          callsForService.push(new google.maps.LatLng($scope.tiles[i].centerPoint.lat, $scope.tiles[i].centerPoint.lon));
        }

        var map, pointArray, heatmap;
        var mapOptions = {
          zoom: 10,
          //center: {latitude: 43.650505, longitude: -79.383989},
          //center: new google.maps.LatLng($scope.currentLocation.center.latitude, $scope.currentLocation.center.longitude),
          center: new google.maps.LatLng(43.650505,-79.383989),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          pan: true,
          //options : {panControl:true, tilt:45},
          //options: {scrollwheel: false, pan: true, panControl: true, tilt: 45, mapTypeId: google.maps.MapTypeId.HYBRID}
          //options: {scrollwheel: false,pan: true, panControl:true, tilt:45, mapTypeId: google.maps.MapTypeId.SATELLITE }
          options: {scrollwheel: false,pan: true, panControl:true, tilt:45}
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);


        //map.center = {
        //  latitude: $scope.currentLocation.center.latitude,
        //  longitude: $scope.currentLocation.center.longitude
        //};

        pointArray = new google.maps.MVCArray(callsForService);

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: pointArray
        });

        heatmap.setMap(map);

      }

    }


    /**
     * Displays the demographic information for the carrier data
     */
    $scope.showVisitorMapData = function() {
      if($scope.tiles!=null) {
        //console.log("Visitor Tiles=" + $scope.tiles.length);

        var info = "";
        var visitorData = [];
        visitorData.push(['Lat', 'Long', 'Demographics','Marker']);
        var size = Math.min($scope.tiles.length,200); // cut it off at 200 max
        for (var i = 0;i < size;i++){
          info = createInfoWindow($scope.tiles[i]);
          //console.log( "Info:" + info);
          if($scope.tiles[i].sampleSize>=4) {
            visitorData.push([$scope.tiles[i].centerPoint.lat, $scope.tiles[i].centerPoint.lon, info, 'pink']);
          } else if($scope.tiles[i].sampleSize >2 ){
            visitorData.push([$scope.tiles[i].centerPoint.lat, $scope.tiles[i].centerPoint.lon, info, 'blue']);
          } else {
            visitorData.push([$scope.tiles[i].centerPoint.lat, $scope.tiles[i].centerPoint.lon, info, 'green']);
          }
        }


        var data = google.visualization.arrayToDataTable(visitorData);
        //var url = 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/';
        var url = 'assets/images/';

        var options = {
          width: document.getElementById("container").clientWidth,
          height: 500,
          zoomLevel: 10,
          //center: {latitude: $scope.currentLocation.center.latitude, longitude: $scope.currentLocation.center.longitude},
          center: {latitude: 43.650505, longitude: -78.383989},
          mapType: 'normal',
          showTip: true,
          icons: {
            blue: {
              normal:   url + 'purple-pin.png',
              selected: url + 'purple-pin.png'
            },
            green: {
              normal:   url + 'green-pin.png',
              selected: url + 'green-pin.png'
            },
            pink: {
              normal:   url + 'purple-pin.png',
              selected: url + 'purple-pin.png'
            }
          }
        };


      //  //var options = {showTip: true};
        var map = new google.visualization.Map(document.getElementById('visitor_div'));
        map.pan = true;
        map.center = {
          latitude: 43.650505,
          longitude: -79.383989
        };
        map.draw(data, options);

      }

    }


    function createInfoWindow(tile) {
      var htmlStart = "<html><body>";
      var htmlEnd = "</body></html>";

      var tableStart = "<table style='border: 1px solid black;'>";
      var tableEnd = "</table>";
      var rowStart = "<tr style='border: 1px solid black;'>";
      var rowEnd = "</tr>";
      var sampleSize = "<b>Visitors:  </b>" + tile.sampleSize + "</br>";
      // if(tile.demographic.reports[0] != null && tile.demographic.reports[0]["HH_TOT"] != null) {
      //   var houseHoldSize = "<b>Households:  </b>" + tile.demographic.reports[0]["HH_TOT"] + "</br>";
      // } else {
      //   var houseHoldSize = "<b>Households:  </b>" + "N/A" + "</br>";
      // }
      //
      // if(tile.demographic.reports[0] != null && tile.demographic.reports[0]["IN_MHH"] != null) {
      //   var income = "<b>Average Income:  </b>" + tile.demographic.reports[0]["IN_MHH"] + "</br>";
      // } else {
      //   var income = "<b>Average Income:  </b>" + "N/A" + "</br>";
      // }
      var ethnicTitle  = "<b>Ethnicity breakdown:</b></br>";

      var tableHeadings = "<tr style='border: 1px solid black;'>" +
        "<th style='border: 1px solid black;padding: 5px;'>ABO</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>AFR</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>ASIA</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>CAR</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>EEU</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>LAM</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>NEU</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>SA</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>SEU</th>" +
        "<th style='border: 1px solid black;padding: 5px;'>WEU</th>" +
        "</tr>";


      // var aboCount =  tile.demographic.reports[0]["ET_ABOO"];
      // var weuCount =  tile.demographic.reports[0]["ET_WEUO"];
      // var neuCount =  tile.demographic.reports[0]["ET_NEUO"];
      // var eeuCount =  tile.demographic.reports[0]["ET_EEUO"];
      // var seuCount =  tile.demographic.reports[0]["ET_SEUO"];
      // var caroCount = tile.demographic.reports[0]["ET_CARO"];
      // var lamoCount = tile.demographic.reports[0]["ET_LAMO"];
      // var afroCount = tile.demographic.reports[0]["ET_AFRO"];
      // var asiaCount = tile.demographic.reports[0]["ET_ASIAO"];
      // var saCount  =  tile.demographic.reports[0]["ET_SA"];
      //
      //
      // var ethnicTotal = 0;
      // if(aboCount!=null) {
      //   ethnicTotal += parseInt(aboCount);
      // } else {
      //   aboCount = 0;
      // }
      // if(weuCount!=null) {
      //   ethnicTotal += parseInt(weuCount);
      // } else {
      //   weuCount = 0;
      // }
      // if(neuCount!=null) {
      //   ethnicTotal += parseInt(neuCount);
      // }  else {
      //   neuCount = 0;
      // }
      // if(eeuCount!=null) {
      //   ethnicTotal += parseInt(eeuCount);
      // } else {
      //   eeuCount = 0;
      // }
      // if(seuCount!=null) {
      //   ethnicTotal += parseInt(seuCount);
      // } else {
      //   seuCount = 0;
      // }
      // if(caroCount!=null) {
      //   ethnicTotal += parseInt(caroCount);
      // } else {
      //   caroCount = 0;
      // }
      // if(lamoCount!=null) {
      //   ethnicTotal += parseInt(lamoCount);
      // } else {
      //   lamoCount = 0;
      // }
      // if(afroCount!=null) {
      //   ethnicTotal += parseInt(afroCount);
      // } else {
      //   afroCount = 0;
      // }
      // if(asiaCount!=null) {
      //   ethnicTotal += parseInt(asiaCount);
      // } else {
      //   asiaCount = 0;
      // }
      // if(saCount!=null) {
      //   ethnicTotal += parseInt(saCount);
      // }  else {
      //   saCount = 0;
      // }
      //
      // var abo = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (aboCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var afr = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (afroCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var car = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (caroCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var eeu = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (eeuCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var lam = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (lamoCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var neu = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (neuCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var seu = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (seuCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var asa = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (asiaCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var sa = "<td style='border: 1px solid black;padding: 5px;align-content: center'>"  + (saCount/ethnicTotal*100).toPrecision(2) + "</td>";
      // var weu = "<td style='border: 1px solid black;padding: 5px;align-content: center'>" + (weuCount/ethnicTotal*100).toPrecision(2) + "</td>";
      //
      // var info = htmlStart + sampleSize + houseHoldSize + income + ethnicTitle +
      //     tableStart +
      //     tableHeadings +
      //     rowStart +
      //     abo +
      //     afr +
      //     asa +
      //     car +
      //     eeu +
      //     lam +
      //     neu +
      //     sa +
      //     seu +
      //     weu +
      //     rowEnd +
      //     tableEnd +
      //     htmlEnd;

      //return info;

    }





    /**
     * Displays the graph for the daily carrier visits
     */
    $scope.showCarrierDailyVisitorData = function () {
      //console.log("Graphing carrier visitors data" );
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      if (window.innerWidth < 984) {
        var options = {
          //width: 1075,
          width: document.getElementById("container").clientWidth - 50,
          height: 300,
          colors: ['#ffffff', '#6ebe44'],
          chartArea: {left: 60, top: 60, width: '100%'},
          legend: {
              position: 'none',
          },
          tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
          isStacked: true,
          fontSize: 11,
          hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
          vAxis: {title: "Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
        };
      }
      else {
        var options = {
          //width: 1075,
          width: document.getElementById("container").clientWidth - 50,
          height: 500,
          colors: ['#ffffff', '#6ebe44'],
          chartArea: {left: 60, top: 60, width: '100%'},
          legend: {
              position: 'none',
          },
          tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
          isStacked: true,
          fontSize: 11,
          hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
          vAxis: {title: "Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
        };
      }

      visitorchart = new google.visualization.ColumnChart(document.getElementById('carrier_visitors_barchart_div'));
      visitorchart.draw($scope.carriervisitordata, options);

       if (window.innerWidth < 984) {
         $(window).resize(function(){
            var options = {
              height: 300,
              colors: ['#ffffff', '#6ebe44'],
              chartArea: {left: 60, top: 60, width: '100%'},
              legend: {
                  position: 'none',
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              isStacked: true,
              fontSize: 11,
              hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Visitors", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
            };
            visitorchart.draw($scope.carriervisitordata, options);
         });
       }
       else {
         $(window).resize(function(){
            var options = {
              height: 500,
              colors: ['#ffffff', '#6ebe44'],
              chartArea: {left: 60, top: 60, width: '100%'},
              legend: {
                  position: 'none',
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              isStacked: true,
              fontSize: 11,
              hAxis: {title: "Date", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Visitors", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
            };
            visitorchart.draw($scope.carriervisitordata, options);
         });
       }



      // Every time the table fires the "select" event, it should call your
      // select Handler() function.
      google.visualization.events.addListener(visitorchart, 'select', selectCarrierDayHandler);
    }


    /**
     * Adds a clickable listener to the chart that updates
     * the time breakdown chart on clicking
     * @param e
     */
    function selectCarrierDayHandler(e) {
      var selection = visitorchart.getSelection();
      //console.log("Carrier Selection " + selection.length);
      var index;
      var item = selection[0];
      if (item != null) {
        if (item.row != null && item.column != null) {
          index = item.row;
        }

        showCarrierDay(index);
        $scope.$apply();
      }
    }

    var showCarrierDay = function (day) {
      //console.log("Carrier Day Index:" + day);

      if ($scope.carrierReports[day] != null) {
        $scope.showHourlyCarrierVisitorData(day);
        $scope.showCarrierDwellTimesData(day);
      }
    }


    /**
     * Displays the carrier traffic hourly graph for the specific day
     * @param day
     */
    $scope.showHourlyCarrierVisitorData = function (day) {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing hourly carrier data...");
      if (window.innerWidth < 984) {
         var options = {
           //width: 1075,
           width: document.getElementById("container").clientWidth - 50,
           height: 350,
           colors: ['#6ebe44'],
           chartArea: {left: 60, top: 60, width: '90%'},
           legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           fontSize: 11,
           hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Interactions", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
         };
      }
      else {
         var options = {
           //width: 1075,
           width: document.getElementById("container").clientWidth - 50,
           height: 550,
           colors: ['#6ebe44'],
           chartArea: {left: 60, top: 60, width: '90%'},
           legend: {
               position: 'none',
               textStyle: { fontName: 'telusweb', fontSize: 12 }
           },
           fontSize: 11,
           tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
           hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
           vAxis: {title: "Interactions", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
           //fontSize:9
         };
      }


      var linechart = new google.visualization.AreaChart(document.getElementById('carrier_timebreakdown_chart_div'));
      //console.log("Graphing ..." + $scope.hourlyVisitorData);
      var hours = $scope.carrierHourlyData[day];
      var hourly = google.visualization.arrayToDataTable(hours);
      linechart.draw(hourly, options);


      if (window.innerWidth < 984) {
        $(window).resize(function(){
           var options = {
             height: 350,
             colors: ['#6ebe44'],
             chartArea: {left: 60, top: 60, width: '100%'},
             legend: {
                 position: 'none',
                 textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Interactions", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
           };
          linechart.draw(hourly, options);
        });
      }
      else {
        $(window).resize(function(){
           var options = {
             height: 550,
             colors: ['#6ebe44'],
             chartArea: {left: 60, top: 60, width: '100%'},
             legend: {
                 position: 'none',
                 textStyle: { fontName: 'telusweb', fontSize: 12 }
             },
             fontSize: 11,
             tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
             hAxis: {title: "Hours", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
             vAxis: {title: "Interactions", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
           };
           linechart.draw(hourly, options);
        });
      }



    }


    /**
     * Displays the dwell time graph for carrier data
     */
    $scope.showCarrierDwellTimesData = function (day) {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing carrier visitor dwell time data for day:" + day);

      if (window.innerWidth < 984) {
        var options = {
          width: document.getElementById("container").clientWidth - 50,
          height: 350,
          colors: ['#6ebe44'],
          chartArea: {left: 60, top: 60, width: '100%'},
          legend: {
              position: 'none',
              textStyle: { fontName: 'telusweb', fontSize: 12 }
          },
          fontSize: 11,
          tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
          hAxis: {title: "Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
          vAxis: {title: "Duration", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
        };
      }
      else {
        var options = {
          width: document.getElementById("container").clientWidth - 50,
          height: 550,
          colors: ['#6ebe44'],
          chartArea: {left: 60, top: 60, width: '100%'},
          legend: {
              position: 'none',
              textStyle: { fontName: 'telusweb', fontSize: 12 }
          },
          fontSize: 11,
          tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
          hAxis: {title: "Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
          vAxis: {title: "Duration", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
        };
      }


      var linechart = new google.visualization.AreaChart(document.getElementById('carrier_visitor_chart_div'));
      $scope.carrierDwellTimeData = []

      var dwellTimes = $scope.carrierReports[day].dwellTimes;

      $scope.averageCarrierVisitDuration = $scope.carrierReports[day].averageDwellTime;
      var dwellTimeItem = ['Minutes', 'Number of Durations of Length x', {role: 'style'}];
      $scope.carrierDwellTimeData.push(dwellTimeItem);
      if (dwellTimes != null) {
        for (var j = 0; j < dwellTimes.length; j++) {
          dwellTimeItem = [j, dwellTimes[j], '#6ebe44'];
          $scope.carrierDwellTimeData.push(dwellTimeItem);
        }
        var minutesData = google.visualization.arrayToDataTable($scope.carrierDwellTimeData);
        linechart.draw(minutesData, options);


        if (window.innerWidth < 984) {
          $(window).resize(function(){
             var options = {
              height: 350,
              colors: ['#6ebe44'],
              chartArea: {left: 60, top: 60, width: '100%'},
              legend: {
                  position: 'none',
                  textStyle: { fontName: 'telusweb', fontSize: 12 }
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              hAxis: {title: "Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Duration", format:'#', slantedText: true, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
             };
             linechart.draw(minutesData, options);
          });
        }
        else {
          $(window).resize(function(){
             var options = {
              height: 550,
              colors: ['#6ebe44'],
              chartArea: {left: 60, top: 60, width: '100%'},
              legend: {
                  position: 'none',
                  textStyle: { fontName: 'telusweb', fontSize: 12 }
              },
              tooltip: { textStyle: { fontName: 'telusweb', fontSize: 12 } },
              hAxis: {title: "Visitors", format:'#',textStyle: { fontName: 'telusweb', fontSize: 12 }} ,
              vAxis: {title: "Duration", format:'#', slantedText: false, slantedTextAngle: 45, textStyle: {fontName: 'telusweb', fontSize: 12 }},
             };
             linechart.draw(minutesData, options);
          });
        }





      } else {
        $scope.averageCarrierVisitDuration = "N/A";
      }



    }


    $scope.showTweeters = function () {
      document.getElementById("contentArea").style.visibility = "visible";
      $scope.currentLocation = {id: "", name: $scope.searchString, address: "", lat: "", lng: ""};
      $scope.dayrange = "30";
      //$scope.$apply();
      $scope.findTweeters();
    }


    $scope.findTweeters = function () {
      $scope.tweeterResults;
      var geocoder = new google.maps.Geocoder();
      if ($scope.searchString != null) {
        //console.log("Searching for tweeters at address :" + $scope.searchString);
        //console.log("Days :" + $scope.dayrange + " Meters :" + $scope.searchrange + " Limit :" + $scope.limit);

        geocoder.geocode({'address': $scope.searchString}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            //console.log("status:" + results[0].geometry.location);
            $scope.marker.coords = {
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            };

            $scope.marker.options = {
              name: $scope.searchString
            };
            $scope.circles[0].radius = $scope.searchrange;
            $scope.map.pan = true;
            $scope.map.center = {
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            };
            $scope.circles[0].center = {
              latitude: results[0].geometry.location.lat(),
              longitude: results[0].geometry.location.lng()
            };

          } else {
            //console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
        $scope.address = $scope.searchString;
        $scope.searchrange = 1000;
        $scope.limit = "200";
        //var params = {"searchString": $scope.searchString, "days":7, "range":1000, "top":100};
        var params = {
          "searchString": $scope.searchString,
          "days": $scope.dayrange,
          "range": $scope.searchrange,
          "top": $scope.limit
        };
        //console.log(params);
        $scope.tweeters = TweeterSearch.query(params);

        $scope.tweeters.$promise.then(function (results) {
          //console.log("Tweeters size:" + results.length);
          $scope.tweeterResults = new Array(results.length);

          for (var i = 0; i < results.length; i++) {
            $scope.tweeterResults[i] = results[i];
          }
          $rootScope.$broadcast('newResultsEvent', $scope.tweeterResults);
          TweeterResults.setTweeters($scope.tweeterResults);
        });
      }
    }
  })


  .controller('AccordionDemoCtrl', function ($scope) {
    $scope.oneAtATime = true;
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: true
    };
  })


  .controller('DatepickerDemoCtrl', function ($scope) {
    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
      $scope.status.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
      [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

    $scope.getDayClass = function (date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }

      }

      return '';
    };
  })


  .controller('DropdownCtrl', function ($scope, $log) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    $scope.status = {
      isopen: true
    };

    $scope.toggled = function (open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  })

  .controller('FilterController', function ($scope, $filter) {
    var date = new Date();
    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.ddMMMMyyyy = $filter('date')(new Date(), 'dd, MMMM yyyy');
    $scope.HHmmss = $filter('date')(new Date(), 'HH:mm:ss'); //24 hour
    $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm a');  //12hour
  })
