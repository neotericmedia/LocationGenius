var Tile = {};
Tile.TileSize = 250;
Tile.latMetersPerLatitude = 111131;
Tile.latDegreesPerTile = Tile.TileSize / 111131;
Tile.lngDegreesPerTile = [];
Tile.lngMetersPerLongitude =
    [
    111319, 111302, 111252, 111167, 111050, 110898, 110713, 110495, 110243, 109957,   // 0 - 9
    109639, 109287, 108902, 108484, 108033, 107550, 107034, 106485, 105904, 105291,   // 10 - 19
    104647, 103970, 103262, 102522, 101751, 100950, 100117, 100117, 98361, 97438,   // 20 - 29
    96486, 95504, 94493, 93453, 93453, 91288, 90163, 89011, 87832, 86626,   // 30 - 39
    86626, 84135, 84135, 81540, 81540, 78846, 77463, 76055, 74625, 73171    // 40 - 49
    ];
Tile.Init1 = function()
{
    for (var i = 0; i < 50; i++) {
        Tile.lngDegreesPerTile[i] = Tile.TileSize / Tile.lngMetersPerLongitude[i];
    }

}
Tile.Init1();
Tile.Init = function (map)
{
    Tile.map = map;
}
Tile.ConvertFromMicroserviceFormatToInternalFormat = function(tiles)
{
    function incomeSlot(val)
    {
        if (val < 40000) return (0);
        if (val < 50000) return (1);
        if (val < 60000) return (2);
        if (val < 70000) return (3);
        if (val < 80000) return (4);
        if (val < 90000) return (5);
        if (val < 100000) return (6);
        return (7);
    }
    var Tiles = {};
    for(var i=0; i<tiles.length;i++)
    {
        var tile = tiles[i];
        var lat = tile.geoFence.points[3].lat;
        var lng = tile.geoFence.points[3].lon;
        var tileObj = Tile.ConvertLatLngToTileInfo("H", 2, [lat, lng]);
        if(Tiles.hasOwnProperty(tileObj.tileid) == false)
        {
            var d = tile.demographic.reports[0];
            var eth = {
                ABO: d["ET_ABOO"],
                AFR: d["ET_AFRO"],
                CAR: d["ET_CARO"],
                EEU: d["ET_EEUO"],
                LAM: d["ET_LAMO"],
                NEU: d["ET_NEUO"],
                WEU: d["ET_WEUO"]
            }
            tileObj.sample_size = tile.sampleSize;
            tileObj.demog = {};
            tileObj.demog.households = d["HH_TOT"];
            tileObj.demog.hh_income = [0, 0, 0, 0, 0, 0, 0, 0];
            tileObj.demog.hh_income[incomeSlot(d["IN_MHH"])] = d["IN_MHH"];
            tileObj.demog.eth = eth;
            Tiles[tileObj.tileid] = tileObj;
        }
        else {
            Tiles[tileObj.tileid].sample_size += tile.sampleSize
        }
    }
    var arr = [];
    for (var tileid in Tiles)
    {
        arr.push(Tiles[tileid]);
    }
    return (arr);
}
Tile.CreateLatLngRectFromCenter = function(latlng, distanceInMeters)
{
    var lat = latlng.lat();
    var lng = latlng.lng();
    var metersPerLng = Tile.lngMetersPerLongitude[Math.floor(Math.abs(lat))];
    var metersPerLat = Tile.latMetersPerLatitude;
    var latfactor = distanceInMeters / metersPerLat;
    var lngfactor = distanceInMeters / metersPerLng;
    var top = lat + latfactor;
    var bot = lat - latfactor;
    var left = lng - lngfactor;
    var right = lng + lngfactor;
    return (new google.maps.LatLngBounds(new google.maps.LatLng(bot, right), new google.maps.LatLng(top, left)));
}
Tile.ConvertLatLngToTileInfo = function (prefix, zoom, point)
{
    var lat = 90.0 + point[0];
    var lng = 180.0 + point[1];
    var abslatint = Math.floor(Math.abs(point[0]));
    function hashCode(val)
    {
        var hash = 0;
        if (val.length == 0) return hash;
        var len = val.length;
        for (var i = 0; i < len; i++)
        {
            var chr = val.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash &= hash; // Convert to 32bit integer
        }
        return hash;
    }

    if (Tile.lngDegreesPerTile.length == 0)
    {
        Tile.Init();
    }
    var latInt = Math.floor(lat);
    var latFract = lat % 1;
    // we need calculate the lat/long of the top/left of the tile that this lat/long belongs to
    var floatLatBucket = (latFract / Tile.latDegreesPerTile) / zoom;
    var intLatBucket = Math.floor(floatLatBucket);
    var LatTileTop = latInt + (intLatBucket * Tile.latDegreesPerTile * zoom);
    var bot = LatTileTop - (Tile.latDegreesPerTile * zoom);

    var lngInt = Math.floor(lng);
    var lngFract = lng % 1;
    var lngDegreesTile = Tile.lngDegreesPerTile[abslatint];
    var floatLngBucket = (lngFract / lngDegreesTile) / zoom;
    var intLngBucket = Math.floor(floatLngBucket);
    var LngTileLeft = lngInt + (intLngBucket * lngDegreesTile * zoom);
    var right = LngTileLeft + (lngDegreesTile * zoom);

    var tileid = prefix+latInt.toString() + "_" + intLatBucket.toString() + "/" + lngInt.toString() + "_" + intLngBucket.toString();
    var bounds = null;
    var center = null;
    if (typeof (google) !== "undefined")
    {
        var ne_true = new google.maps.LatLng(LatTileTop - 90.0, LngTileLeft - 180.0);
        var sw_true = new google.maps.LatLng(bot - 90.0, right - 180.0);
        bounds = new google.maps.LatLngBounds(sw_true, ne_true);
        center = bounds.getCenter()
    }
    var topleft = [LatTileTop - 90.0, LngTileLeft - 180.0];
    var botright = [bot - 90.0, right - 180.0];
    var size = [topleft[0] - botright[0], botright[1] - topleft[1]];
    return (
        {
            bounds: bounds,
            topleft: topleft,
            botright: botright,
            size: size,
            center: center,
            tileid: tileid,
            tilehash: hashCode(tileid)
        }
);
}
Tile.CountTiles = function (tiles)
{
    var cnt = 0;
    for(var tile in tiles)
    {
        cnt++;
    }
    return (cnt);
}
Tile.ConvertBoundsToNESW = function(bounds)
{
    var tl = bounds.getNorthEast();
    var tl_lat = tl.lat();
    var tl_lng = tl.lng();
    var br = bounds.getSouthWest();
    var br_lat = br.lat();
    var br_lng = br.lng();
    return ({ north: tl_lat, south: br_lat, east: br_lng, west: tl_lng });
}

Tile.VerifySize = function(txt, tile)
{
    // return;
    var bounds = tile.bounds;
    var tl = bounds.getNorthEast();
    var tl_lat = tl.lat();
    var tl_lng = tl.lng();
    var br = bounds.getSouthWest();
    var br_lat = br.lat();
    var br_lng = br.lng();
    var h = tl.lat() - br.lat();
    var w = br.lng() - tl.lng();
    // if(h < 0 || w <0)
    {
        console.log(txt + ": " + tile.tileid + ", " + h + "," + w +" ["+tl_lat+","+tl_lng+"],["+br_lat+","+br_lng+"]");
    }
}
Tile.CreateZoomedTileObjects = function(prefix, zoom, objs)
{
    var zoomedObj = {};
    for(var i=0; i<objs.length;i++)
    {
        var thisTile = objs[i];
        var thisTile_demog = thisTile.demog;
        var thisTile_demog_eth = thisTile_demog.eth;

        var zoomedtile = Tile.ConvertLatLngToTileInfo(prefix, zoom, thisTile.topleft);
        //Tile.VerifySize("Tile.CreateZoomedTileObjects", zoomedtile);
        var zoomedtileid = zoomedtile.tileid;

        if (zoomedObj.hasOwnProperty(zoomedtileid) == false)
        {
            zoomedtile = { sample_size: 0, tileid: zoomedtile.tileid, tilehash: zoomedtile.tilehash, topleft: zoomedtile.topleft, botright: zoomedtile.botright, bounds: zoomedtile.bounds, hh_income: [0, 0, 0, 0, 0, 0, 0, 0], eth: {} };
            var zobj_eth = zoomedtile.eth;
            for (var name in thisTile_demog_eth)
            {
                zobj_eth[name] = 0;
            }
            zoomedObj[zoomedtileid] = zoomedtile;
        }
        else
        {
            tileid;
        }
        var zobj = zoomedObj[zoomedtileid];
        var zobj_eth = zobj.eth;
        if (typeof (zobj) == "undefined")
        {
            tileid;
        }
        var sample_size = thisTile.sample_size;
        zobj.sample_size += sample_size;

        for (var name in thisTile_demog_eth)
        {
            zobj_eth[name] += thisTile_demog_eth[name] * sample_size;
        }

        var thisTile_demog_income = thisTile_demog.hh_income;
        var zobj_hh_income = zobj.hh_income;
        for (var j = 0; j < thisTile_demog_income.length; j++)
        {
            zobj_hh_income[j] += thisTile_demog_income[j] * sample_size;
        }
    }
    var tileObjs = [];
    for (var tileid in zoomedObj)
    {
        tileObjs.push(zoomedObj[tileid]);
    }
    // tileObjs.length = 1;
    return (tileObjs);
}
Tile.GetSelectedTiles = function(map)
{
    var selectedTiles = [];
    var list = map.TileList;
    for(var tileid in list)
    {
        var marker = list[tileid];
        if(marker.tileinfo.selected)
        {
            selectedTiles.push(marker);
        }
    }
}
Tile.MakeTile = function(map, zoom, tile, strokeColor, fillColor, mouseOverHtml)
{
    var use_marker = false;
    var infowindow, marker;
    function over(evt)
    {
        infowindow.open(map, marker);
    }
    function out(evt)
    {
        infowindow.close();
    }
    function clicked()
    {
        if (marker.tileinfo.selected)
        {
            marker.tileinfo.selected = false;
            marker.setOptions({ strokeColor: marker.fillColor });
        }
        else
        {
            marker.setOptions({ strokeColor: "black" });
            marker.tileinfo.selected = true;
        }
    }
    if(use_marker == false)
    {
        //Tile.VerifySize("Tile.MakeTile", tile);
        marker = new google.maps.Rectangle({
            bounds: Tile.ConvertBoundsToNESW(tile.bounds),
            strokeColor: strokeColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: fillColor,
            fillOpacity: 0.4
        });
        marker.setMap(map);
    }
    else
    {
        marker = new google.maps.Marker({
            position: tile.bounds.getNorthEast(),
            map: map,
            title: ''
        })
    }
    map.TileList[tile.tileid] = marker;
    infowindow = new google.maps.InfoWindow({
        content: mouseOverHtml,
        position: tile.bounds.getNorthEast()
    });
    marker.tileinfo = { selected: false, topleft: tile.topleft, tileid: tile.tileid };
    google.maps.event.addListener(marker, 'mouseover', over);
    if (use_marker == false)
    {
        google.maps.event.addListener(marker, 'click', clicked);
    }
    google.maps.event.addListener(marker, 'mouseout', out);
}
Tile.PointInRect = function(top, left, bot, right, point)
{
    var go = true;
    var ne_top = point.lat();
    var ne_left = point.lng();
    if (ne_top > top)
        go = false;
    if (ne_top < bot)
        go = false;
    if (ne_left < left)
        go = false;
    if (ne_left > right)
        go = false;
    return (go);
}
Tile.TileColorList = ["yellow", "orange", "green", "blue", "red"];
Tile.TileColor = function(this_sample, max_samples)
{
    var fract = this_sample / max_samples;
    if (fract < .2) return (Tile.TileColorList[0]);
    if (fract < .4) return (Tile.TileColorList[1]);
    if (fract < .6) return (Tile.TileColorList[2]);
    if (fract < .8) return (Tile.TileColorList[3]);
    return (Tile.TileColorList[4])
}
Tile.CreateScatterMap = function (map, displayRect, zoomedTiles, zoom, cb)
{
    var mapBounds;
    if (map.TileList)
    {
        var list = map.TileList;
        for(var tileid in list)
        {
            var tile = list[tileid];
            tile.setMap(null);
        }
        map.TileList = {};
    }
    else
    {
        map.TileList = {};
    }
    mapBounds = new google.maps.LatLngBounds();
    var total_hits = 0;
    var top = displayRect.getNorthEast().lat();
    var bot = displayRect.getSouthWest().lat();
    var left = displayRect.getNorthEast().lng();
    var right = displayRect.getSouthWest().lng();
    var max_samples = 0
    for (var i = 0; i < zoomedTiles.length; i++) {
        var sample = zoomedTiles[i].sample_size;
        if(sample > max_samples)
        {
            max_samples = sample;
        }
    }
    var template = $("#Main_Demographics_MouseOverTemplate").html();
    for (var i = 0; i < zoomedTiles.length; i++)
    {
        var tile = zoomedTiles[i];
        var ne = tile.bounds.getNorthEast();
        if (Math.floor(ne.lat()) == 43)
        {
            var xxx = 3;
        }
        var go = Tile.PointInRect(top, left, bot, right, ne);
        if (go)
        {
            mapBounds.extend(ne);
        }
        var preparedTile = Tile.prepareTileForCharting(tile, false);
        //var mouseOverHtml = $.jqext.str.FormatUsingTemplate(template,
        //    {
        //        lat: preparedTile.topleft[0].toFixed(5),
        //        lng: preparedTile.topleft[1].toFixed(5),
        //        samplesize: preparedTile.sample_size,
        //        hh_cnt: preparedTile.hh_cnt,
        //        income_chart: Tile.MakeChart("mouseover", 200, preparedTile.income_chart),
        //        eth_chart: Tile.MakeChart("mouseover", 200, preparedTile.eth_chart)
        //    }
        //);
      var mouseOverHtml = "";
        var tile_color = Tile.TileColor(tile.sample_size, max_samples);
        Tile.MakeTile(map, zoom, preparedTile, strokeColor = tile_color, fillColor = tile_color, mouseOverHtml);
    }
    map.fitBounds(mapBounds);
    return (zoomedTiles);
}
Tile.IncomeBracketNames = ["< $40K", "< $50K", "< $60K", "< $70K", "< $80K", "< $90K", "< $100K", "> $100K"];
Tile.CreateSummaryData = function(zoomedTiles)
{
    var summary_sample_size = 0;
    var summary_hh_cnt = 0;
    var eth = {};
    var income = [0,0,0,0,0,0,0,0];

    for (var i = 0; i < zoomedTiles.length; i++)
    {
        var tile = zoomedTiles[i];
        var tile_eth = tile.eth;
        var tile_inc = tile.hh_income;
        var sample_size = tile.sample_size;
        if (i == 0)
        {
            for (var eth_name in tile_eth)
            {
                eth[eth_name] = 0;
            }
        }
        summary_sample_size += sample_size;
        for(var eth_name in tile_eth)
        {
            eth[eth_name] += tile_eth[eth_name] * sample_size;
        }
        for(var j=0; j<tile_inc.length;j++)
        {
            var cnt = tile_inc[j];
            income[j] += cnt * sample_size;
            summary_hh_cnt += cnt;
        }
    }
    return ({ sample_size: summary_sample_size, hh_cnt:summary_hh_cnt, eth: eth, hh_income: income });
}
Tile.prepareTileForCharting = function (tile, exclude_zeros)
{
    function makeEthName(name)
    {
        return(name);
    }
    function makeEthColor(name)
    {
        return("yellow");
    }
    function makeIncomeColor(index)
    {
        return("yellow");
    }

    var result = { sample_size: tile.sample_size, hh_cnt: 0, tileid: tile.tileid, topleft: tile.topleft, bounds: tile.bounds, botright: tile.botright, income_chart: [], eth_chart: [] };
    var eth_cnt = {};
    var tile_eth = tile.eth;
    var tot = 0;
    for (var ethname in tile_eth)
    {
        tot += tile_eth[ethname];
    }
    for (var ethname in tile_eth)
    {
        var fract = tile_eth[ethname] / tot;
        result.eth_chart.push({ name: makeEthName(ethname), fract: fract, cnt:tile_eth[ethname], tot: tot, color: makeEthColor(ethname) });
    }

    var tot = 0;
    var tile_hhincome = tile.hh_income;
    for (var i = 0; i < tile_hhincome.length; i++)
    {
        tot += tile_hhincome[i];
    }
    for (var i = 0; i < tile_hhincome.length; i++)
    {
        var fract = tile_hhincome[i] / tot;
        if(fract == 0 && exclude_zeros)
        {
            continue;
        }
        result.income_chart.push({ name: Tile.IncomeBracketNames[i], fract: fract, color: makeIncomeColor(i) });
    }
    result.hh_cnt = tot;
    return (result);
}
Tile.CreateGoogleChart = function(div, title, chartData)
{
    var data = new google.visualization.DataTable();
    var rows = [];
    for (var i = 0; i < chartData.length; i++)
    {
        var item = chartData[i];
        rows.push([item.name, Math.round(item.fract * 100)]);
    }
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Percentage');
    data.addRows(rows);

    // Set chart options
    var options = {
        'title': title,
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById(div));
    chart.draw(data, options);
}

Tile.MakeChart = function(class_base, width, eth_data)
{
    function percent(fract)
    {
        return (Math.round(fract * 100));
    }
    var html = [];
    html.push("<table cellspacing='0' cellpadding='0' style='border-collapse: collapse'><tr>")
    for (var i = 0; i < eth_data.length; i++)
    {
        html.push("<td><div class='infobubblecelltitle'>" + $.jqext.html.encode(eth_data[i].name) + "</div></td>")
    }
    html.push("</tr><tr>");
    for (var i = 0; i < eth_data.length; i++)
    {
        html.push("<td><div  class='infobubblecell'>" + percent(eth_data[i].fract) + "%</div></td>");
    }
    html.push("</tr>");
    html.push("</table>");
    return(html.join(""));
}
Tile.MakeMouseoverHtml = function (class_base, width, info)
{
    var html = [];
    html.push("<table>");
    html.push("<tr><td colspan='3'>[" + info.topleft[0].toFixed(5) + "," + info.topleft[1].toFixed(5) + "]</td></tr>");
    html.push("<tr><td class='infobubblelabel'>Sample size</td><td>&nbsp;</td><td>" + info.sample_size + "</td></tr>");
    html.push("<tr><td class='infobubblelabel'>Households in sample area</td><td>&nbsp;</td><td>" + info.hh_cnt + "</td></tr>");

    html.push("<tr><td class='infobubblelabel'>Income distribution:</td>");
    html.push('<tr><td colspan="3">');
    html.push(Tile.MakeChart(class_base, width, info.income_chart));
    html.push("</td></tr>");

    html.push("<tr><td class='infobubblelabel'>Ethnicity distribution</td></tr>");
    html.push('<tr><td colspan="3">');
    html.push(Tile.MakeChart(class_base, width, info.eth_chart));
    html.push("</td></tr>");
    html.push("</table>");

    var txt = html.join("");
    return (txt);
}
Tile.Init();
