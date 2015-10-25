'use strict';

angular.module('telusLg2App')
  .controller('MainCtrl', function ($scope, $http, $rootScope, TweeterSearch, TweeterResults, TweetReports, LocationResults, OnsitePregenReport, CarrierPregenReport) {
    var visitorchart;
    var onsiteVisitorChart;

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var incomeLevelsLabels = ["$0-$39,000", "$40,000-$59,000", "$60,000-$79,000", "$80,000-$99,000", "$100,000-$124,000", "$125,000+"];
    var ethnicitieLabels = {"ABOO":"Aboriginal", "AFRO":"African","CARO":"Carribean","EEUO":"Eastern European","LAMO":"Latin American","NEUO":"Northern European","SEUO":"Southern European","WEUO":"Western European"};


    $scope.words = [];
    //$scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];
    $scope.colors = ["#6ebe44","#6ebe44","#6ebe44","#6ebe44","#6ebe44","#6ebe44","#6ebe44"];



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


    /*************************************************************************************
     *  When a new location is selected, generate the reports and add a marker on the map
     *************************************************************************************/
    $scope.setSelectedLocation = function (location) {
      //console.log("Setting selected location:" + location.name);
      document.getElementById("contentArea").style.display = "block";

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
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
      };

      $scope.marker.options = {
        name: $scope.currentLocation.name
      };
      $scope.circles[0].radius = $scope.searchrange;
      $scope.map.pan = true;
      $scope.map.center = {
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
      };


      //console.log("Setting map Location lat:" + $scope.currentLocation.center.latitude);
      //console.log("Setting map Location lng:" + $scope.currentLocation.center.longitude);

      $scope.circles[0].center = {
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
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
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
      };

      $scope.marker.options = {
        name: $scope.currentLocation.name
      };
      $scope.circles[0].radius = $scope.searchrange;
      $scope.map.pan = true;
      $scope.map.center = {
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
      };
      $scope.circles[0].center = {
        latitude: $scope.currentLocation.center.latitude,
        longitude: $scope.currentLocation.center.longitude
      };
    }


    $scope.showDailySocialData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      var options = {
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 20, top: 60, width: '100%'},
        legend: {position: 'bottom'},
        format: 'short',
        fontSize: 11,
        hAxis: {
          //textPosition: 'none',
          slantedText: true,
          slantedTextAngle: 45
        }
      };

      chart = new google.visualization.ColumnChart(document.getElementById('barchart_div'));
      chart.draw($scope.data, options);

      $(window).resize(function(){
         var options = {
           height: 550,
           colors: ['#6ebe44'],
           chartArea: {left: 20, top: 60, width: '100%'},
           legend: {position: 'bottom'},
           format: 'short',
           fontSize: 11,
           hAxis: {
             slantedText: true,
             slantedTextAngle: 45
            }
          };
         chart.draw($scope.data, options);
      });

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


    var showDay = function (day) {
      //console.log("Day Index:" + day);
      $scope.dayIndex = day;
      if ($scope.tweetReports.dailyReports[$scope.dayIndex] != null) {
        $scope.dailyReportDate = $scope.tweetReports.dailyReports[$scope.dayIndex].day.toLowerCase();
        $scope.showHourlySocialData($scope.dayIndex);
      }
    }


    $scope.showHourlySocialData = function (day) {
      var options = {
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        legend: {position: 'bottom'},
        chartArea: {left: 20, top: 60, width: '100%'},
        fontSize: 11,
        hAxis: {
          //textPosition: 'none',
          slantedText: true,
          slantedTextAngle: 45
        }
      };
      var linechart = new google.visualization.AreaChart(document.getElementById('linechart_div'));
      var hours = $scope.hourlyData[day];
      var hourly = google.visualization.arrayToDataTable(hours);
      linechart.draw(hourly, options);

      $(window).resize(function(){
         var options = {
           height: 550,
           colors: ['#6ebe44'],
           legend: {position: 'bottom'},
           chartArea: {left: 0, top: 60, width: '100%'},
           fontSize: 11,
           hAxis: {
             //textPosition: 'none',
             slantedText: true,
             slantedTextAngle: 45
           }
         };
         linechart.draw(hourly, options);
      });

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
        {
          filterId: 4,
          time: 'Last 3 Months',
          showLast84days: function () {
            $scope.getSocialDayReport(84);
          }
        },
        {
          filterId: 5,
          time: 'Last 4 Months',
          showLast112days: function () {
            $scope.getSocialDayReport(112);
          }
        }
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
            item = [day, dailyReports[i].tweets, '#6ebe44'];
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
      return months[parseInt(startMonth) - 1] + " " + startDay + " to " + months[parseInt(endMonth) - 1] + " " + endDay + ", " + endYear;

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
      $scope.weeklyChange = "N/A";
      $scope.mostFrequestCustomer = "N/A";
      $scope.mostFrequestCustomerVisits = "N/A";
      $scope.busiestHourDay = "N/A";
      $scope.busiestHour = "N/A";
      $scope.busiestHourVisits = "N/A";

      var dailyVisitorData = [];
      var item = ['Day', 'Number of Visitors', {role: 'style'}, 'New Visitors', {role: 'style'}];
      dailyVisitorData.push(item);

      //console.log("Getting onsite report for :" + $scope.currentLocation.buildingId);

      var dateobj = new Date();
      var month = dateobj.getMonth() + 1;
      var day = dateobj.getDate();
      var year = dateobj.getFullYear();

      //if("buildingId" == "188" || "buildingId" == "189") params = {"buildingId": $scope.currentLocation.buildingId, "dt": d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay()};


      //new aug 19
      var buildingId = $scope.currentLocation.buildingId;

      if (buildingId === "188" || buildingId === "189" || buildingId === "122") {
        var params = {"buildingId": $scope.currentLocation.buildingId, "dt": year + "-" + month + "-" + day};
      }
      else if (buildingId === "190") {
        var params = {"buildingId": $scope.currentLocation.buildingId, "dt": "2015-08-01"};
      }
      else {
        var params = {"buildingId": $scope.currentLocation.buildingId, "dt": "2015-04-26"};
      }


      //console.log("Onsite Report params..." + params.buildingId + " " + params.dt);
      $scope.report = OnsitePregenReport.query(params);
      $scope.report.$promise.then(function (results) {
        //console.log("Onsite Report Results:" + results.totalVisits);
        if (results != null) {
          $scope.onsiteVisitorsWeek = results.totalVisits.toString().toLocaleString();
          //$scope.onsiteVisitorsWeek.toLocaleString();
          $scope.onsiteWeek = results.weekName;
          $scope.averageVisitorsDay = results.averageVisitorsDay;
          $scope.weeklyChange = results.weeklyChange.toFixed(2);
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


          if ($scope.weeklyChange > 0) {
            $scope.changeImage = "up";
          }
          if ($scope.weeklyChange < 0) {
            $scope.changeIma = "glyphicon glyphicon-chevron-down";
          }


          if ($scope.weeklyChange > 0) {
            $scope.changeIcon = "fa fa-angle-up";
          }
          if ($scope.weeklyChange < 0) {
            $scope.changeIcon = "fa fa-angle-down";
          }


          var dailyReports = results.days;
          var item;

          for (var i = 0; i < dailyReports.length; i++) {
            if (dailyReports[i] != null) {
              //console.log("Visits on " + dailyReports[i].dayOfWeek + " " + dailyReports[i].day + ":" + dailyReports[i].total_visit);
              var date = dailyReports[i].dayOfWeek + ", " + dailyReports[i].day;
              item = [date, dailyReports[i].total_visit, '#49166d', dailyReports[i].newMac, '#6ebe44'];
              dailyVisitorData.push(item);
            }
          }

          var hourlyReports = results.hourly_breakdown;
          $scope.hourlyVisitorData = [];
          var hourlyitem = ['Hour', 'Number of Visitors', {role: 'style'}];
          $scope.hourlyVisitorData.push(hourlyitem);

          //var hourlyTotals = results.hourlyBreakdown;
          $scope.onsiteHourlyTotals = results.hourlyData;


          var durations = results.durations;
          $scope.durationData = [];
          var durationitem = ['Minutes', 'Duration of Visit (Min)', {role: 'style'}];
          $scope.durationData.push(durationitem);
          for (var i = 0; i < durations.length; i++) {
            durationitem = [i, durations[i], '#6ebe44'];
            $scope.durationData.push(durationitem);
          }

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
      var options = {
        //width: {width: '100%'},
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#ffffff', '#6ebe44'],
        chartArea: {left: 60, top: 60, width: '100%'},
        //legend: { position: 'bottom'},
        legend: {position: 'none'},
        //legend: { position: 'top', maxLines: 3 },
        isStacked: true,
        hAxis: {
          //textPosition: 'none',
          slantedText: true,
          slantedTextAngle: 45
        }
      };

      onsiteVisitorChart = new google.visualization.ColumnChart(document.getElementById('onsite_visitors_barchart_div'));
      onsiteVisitorChart.draw($scope.visitordata, options);

      $(window).resize(function(){
         var options = {
           width: {width: '100%'},
           height: 550,
           colors: ['#ffffff', '#6ebe44'],
           chartArea: {left: 60, top: 60, width: '100%'},
           legend: {position: 'none'},
           isStacked: true,
           hAxis: {
             //textPosition: 'none',
             slantedText: true,
             slantedTextAngle: 45
           }
         };
          onsiteVisitorChart.draw($scope.visitordata, options);
      });

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
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 50, top: 60, width: '100%'},
        legend: {position: 'bottom', alignment: 'center'},
        hAxis: { format:'#'} ,
        vAxis: { format:'#'}
      };

      var customers = $scope.topCustomers;

      var loyaltyData = [];
      var loyaltyItem = ['Number of Visits', 'Customer Count',{role: 'style'}];
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

       $(window).resize(function(){
          onsiteLoyaltyChart.draw(data, options);
       });

       $(window).resize(function(){
          var options = {
            //width: 1075,
            width: {width: '100%'},
            height: 550,
            colors: ['#6ebe44'],
            chartArea: {left: 50, top: 60, width: '100%'},
            legend: {position: 'bottom', alignment: 'center'},
            hAxis: { format:'#'} ,
            vAxis: { format:'#'}
          };
          onsiteLoyaltyChart.draw(data, options);
       });


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
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 60, top: 60, width: '100%'},
        legend: {position: 'bottom'},
        hAxis: {
         //textPosition: 'none',
         slantedText: true,
         slantedTextAngle: 45
        }
        //fontSize:9
      };


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

       $(window).resize(function(){
          var options = {
            height: 550,
            colors: ['#6ebe44'],
            chartArea: {left: 60, top: 60, width: '100%'},
            legend: {position: 'bottom'},
            hAxis: {
             //textPosition: 'none',
             slantedText: true,
             slantedTextAngle: 45
            }
            //fontSize:9
          };
          linechart.draw(hourly, options);
       });
    }


    $scope.showOnsiteDurationData = function () {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing online visitor duration data...");
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 3, top: 60, width: '100%'},
        legend: {position: 'bottom', alignment: 'center'}
      };

      var linechart = new google.visualization.AreaChart(document.getElementById('onsite_visitor_chart_div'));
      //console.log("Graphing ..." + $scope.durationData);
      var minutesData = google.visualization.arrayToDataTable($scope.durationData);
      linechart.draw(minutesData, options);

       $(window).resize(function(){
          var options = {
            height: 550,
            colors: ['#6ebe44'],
            chartArea: {left: 3, top: 60, width: '100%'},
            legend: {position: 'bottom', alignment: 'center'}
          };
          linechart.draw(minutesData, options);
       });

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

      var item = ['Day', 'Number of Visitors', {role: 'style'}, 'New Visitors', {role: 'style'}];
      dailyCarrierVisitorData.push(item);
      console.log("Getting carrierreport for :" + $scope.currentLocation.buildingId + " for " + numDays + " days");

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
            item = [reports[i].date.substring(5), visitors, '#49166d', newVisitors, '#6ebe44'];

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
        console.log("Tiles=" + $scope.tiles.length);

        Demographics.coalescedTilesWithDemographics = Tile.ConvertFromMicroserviceFormatToInternalFormat($scope.tiles);
        Demographics.drawMap();

        console.log("Incomes=" + $scope.demographicReport.incomeCounts);

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
          incomeData.push([incomeLevelsLabels[i], $scope.demographicReport.incomeCounts[i]/totalIncomes, colour]);
        }

        var data = google.visualization.arrayToDataTable(incomeData);
        var options = {
          //width: 1075,
<<<<<<< HEAD
          width: document.getElementById("container").clientWidth/2,
=======
          width: document.getElementById("container").clientWidth/3 - 50,
>>>>>>> 6fbda4711286317e43202716cd3e5b4ad2747f68
          height: 340,
          colors: ['#ffffff', '#6ebe44'],
          chartArea: {left: 120, top: 30, width: '100%'},
          legend: {position: 'none'}
        };

        var incomeChart = new google.visualization.BarChart(document.getElementById('demographic_income_chart_div'));
        incomeChart.draw(data, options);

        $scope.showHeatMapData();
        $scope.showEthnicData();
      }

    }



    /**
     * Displays the demographic information for the carrier data
     */
    $scope.showEthnicData = function() {

      if($scope.demographicReport!=null) {
        //console.log("ABOO=" + $scope.demographicReport.etABOOCount);
        //console.log("WEUO=" + $scope.demographicReport.etWEUOCount);
        //console.log("NEUO=" + $scope.demographicReport.etNEUOCount);
        //console.log("EEUO=" + $scope.demographicReport.etEEUOCount);
        //console.log("SEUO=" + $scope.demographicReport.etSEUOCount);
        //console.log("CARO=" + $scope.demographicReport.etCAROCount);
        //console.log("LAMO=" + $scope.demographicReport.etLAMOCount);
        //console.log("AFRO=" + $scope.demographicReport.etAFROCount);

        var ethnicData = [];
        ethnicData.push(['Ethnicity', 'Distribution', {role: 'style'}]);

        var ethnicTotal = $scope.demographicReport.etABOOCount +
                          $scope.demographicReport.etWEUOCount +
                          $scope.demographicReport.etNEUOCount +
                          $scope.demographicReport.etEEUOCount +
                          $scope.demographicReport.etSEUOCount +
                          $scope.demographicReport.etCAROCount +
                          $scope.demographicReport.etLAMOCount +
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

        if(otherTotal > 0) {
          ethnicData.push(['Other', otherTotal, 'silver']);
        }

        //ethnicData.push([ethnicitieLabels['ABOO'], $scope.demographicReport.etABOOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['WEUO'], $scope.demographicReport.etWEUOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['NEUO'], $scope.demographicReport.etNEUOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['EEUO'], $scope.demographicReport.etEEUOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['SEUO'], $scope.demographicReport.etSEUOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['CARO'], $scope.demographicReport.etCAROCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['LAMO'], $scope.demographicReport.etLAMOCount/ethnicTotal, 'silver']);
        //ethnicData.push([ethnicitieLabels['AFRO'], $scope.demographicReport.etAFROCount/ethnicTotal, 'silver']);


        var data = google.visualization.arrayToDataTable(ethnicData);
        var options = {
          //width: 1075,
<<<<<<< HEAD
          width: document.getElementById("container").clientWidth/2,
          height: 340,
          //colors: ['#ffffff', '#6ebe44'],
          chartArea: {left: 20, top: 30, width: '100%'},
          legend: {position: 'none'},
          slices: {
            0: { color: '#f9f1ff' },
            1: { color: '#49166d' },
            2: { color: '#b196c1' },
            3: { color: '#8c68a6' },
            4: { color: '#c8bbd0' },
            5: { color: '#c8bbd0' },
            6: { color: '#e0cdf4' },
            7: { color: '#ece7ee' }
          }
=======
          width: document.getElementById("container").clientWidth/1.2,
          height: 340,
          //colors: ['#ffffff', '#6ebe44'],
          chartArea: {left: 0, top: 30, width: '50%'},
          legend: {position: 'right',alignment:'center'},
          is3D: true,
>>>>>>> 6fbda4711286317e43202716cd3e5b4ad2747f68
        };
        var ethnicChart = new google.visualization.PieChart(document.getElementById('demographic_ethnicity_chart_div'));
        ethnicChart.draw(data, options);
      }

    }


    $scope.showHeatMapData = function() {
      if($scope.tiles!=null) {
        console.log("Tiles=" + $scope.tiles.length);
        var callsForService = [];

        for (var i = 0; i < $scope.tiles.length; i++) {
          //console.log("Tile=" + $scope.tiles[i].centerPoint.lat + " " + $scope.tiles[i].centerPoint.lon);
          callsForService.push(new google.maps.LatLng($scope.tiles[i].centerPoint.lat, $scope.tiles[i].centerPoint.lon));
        }



        var map, pointArray, heatmap;
        var mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng($scope.currentLocation.center.latitude, $scope.currentLocation.center.longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map'), mapOptions);


        map.center = {
          latitude: $scope.currentLocation.center.latitude,
          longitude: $scope.currentLocation.center.longitude
        };

        pointArray = new google.maps.MVCArray(callsForService);

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: pointArray
        });

        heatmap.setMap(map);

      }

    }





    /**
     * Displays the graph for the daily carrier visits
     */
    $scope.showCarrierDailyVisitorData = function () {
      //console.log("Graphing carrier visitors data" );
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 500,
        colors: ['#ffffff', '#6ebe44'],
        chartArea: {left: 60, top: 60, width: '100%'},
        //legend: { position: 'bottom'},
        legend: {position: 'none'},
        //legend: { position: 'top', maxLines: 3 },
        isStacked: true,
      };

      visitorchart = new google.visualization.ColumnChart(document.getElementById('carrier_visitors_barchart_div'));
      visitorchart.draw($scope.carriervisitordata, options);

       $(window).resize(function(){
          var options = {
            height: 500,
            colors: ['#ffffff', '#6ebe44'],
            chartArea: {left: 60, top: 60, width: '100%'},
            //legend: { position: 'bottom'},
            legend: {position: 'none'},
            //legend: { position: 'top', maxLines: 3 },
            isStacked: true,
          };
          visitorchart.draw($scope.carriervisitordata, options);
       });
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
      var options = {
        //width: 1075,
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 60, top: 60, width: '100%'},
        legend: {position: 'bottom'},
        hAxis: {
         //textPosition: 'none',
         slantedText: true,
         slantedTextAngle: 45
        }
        //fontSize:9
      };

      var linechart = new google.visualization.AreaChart(document.getElementById('carrier_timebreakdown_chart_div'));
      //console.log("Graphing ..." + $scope.hourlyVisitorData);
      var hours = $scope.carrierHourlyData[day];
      var hourly = google.visualization.arrayToDataTable(hours);
      linechart.draw(hourly, options);

       $(window).resize(function(){
          var options = {
            height: 550,
            colors: ['#6ebe44'],
            chartArea: {left: 60, top: 60, width: '100%'},
            legend: {position: 'bottom'},
            hAxis: {
             //textPosition: 'none',
             slantedText: true,
             slantedTextAngle: 45
            }
            //fontSize:9
          };
          linechart.draw(hourly, options);
       });
    }


    /**
     * Displays the dwell time graph for carrier data
     */
    $scope.showCarrierDwellTimesData = function (day) {
      // Instantiate and draw our chart, passing in some options.
      // Set chart options
      //console.log("Graphing carrier visitor dwell time data for day:" + day);
      var options = {
        width: document.getElementById("container").clientWidth - 50,
        height: 550,
        colors: ['#6ebe44'],
        chartArea: {left: 60, top: 60, width: '100%'},
        legend: {position: 'bottom', alignment: 'center'}
      };

      var linechart = new google.visualization.AreaChart(document.getElementById('carrier_visitor_chart_div'));
      $scope.carrierDwellTimeData = []

      var dwellTimes = $scope.carrierReports[day].dwellTimes;
      console.log("Dwell times:" + dwellTimes.length);
      //console.log("Dwell times:" + dwellTimes);

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

        $(window).resize(function(){
           var options = {
            height: 550,
            colors: ['#6ebe44'],
            chartArea: {left: 60, top: 60, width: '100%'},
            legend: {position: 'bottom', alignment: 'center'}
           };
           linechart.draw(minutesData, options);
        });

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
