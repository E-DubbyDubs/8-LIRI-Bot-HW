require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var terminalLink = require('terminal-link');

var fs = require("fs");
var keys = require("./keys.js");
var data = fs.readFileSync("./random.txt", "utf8");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var search = process.argv[2];
var entireCmdLine = process.argv;
var findThis = "";

var FgBlue = "\x1b[34m";
var FgWhite = "\x1b[0m";
var FgCyan = "\x1b[36m";
var FgGreen = "\x1b[32m";
var FgMagenta = "\x1b[35m";

for (var i = 3; i < entireCmdLine.length; i++) {
    if (i > 3 && i < entireCmdLine.length) {
        findThis = findThis + "+" + entireCmdLine[i];
    } else {
        findThis += entireCmdLine[i];
    };
};
function liriBot() {

    switch (search) {
        case "my-tweets":
            var params = { screen_name: 'CoderChicago' };
            var logIt1 = search.concat(findThis + ", ")
            console.log("Searching " + FgCyan + "Twitter" + FgWhite + " for your tweets!\n");
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    console.log(FgCyan + "----------Twitter Last 20 Tweets!----------\n" + FgWhite);
                    for (i = 0; i < tweets.length && i < 20; i++) {
                        console.log(FgCyan + (i + 1) + ": " + FgWhite + tweets[i].text);
                        console.log(FgCyan + "-- " + tweets[i].created_at.slice(0, 20) + FgWhite);
                        var logIt2 = logIt1 + tweets[i].created_at.slice(0, 20) + " " + tweets[i].text;
                        fs.appendFile("log.txt", logIt2 + "\n", function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            logIt2 = "";
                        });

                    };
                    console.log(FgCyan + "\n-------------------------------------------" + FgWhite);
                    console.log("\nlog.txt was updated!\n");
                };
            });
            break;

        case "spotify-this-song":
            var logIt = search.concat("," + findThis)

            if (findThis === "") {
                findThis = "The+sign+ace+of+base" //  If the user doesn't type a song in, the program will output data for the song "The Sign."
                logIt += "The Sign Ace of Base";
            }

            console.log("Searching " + FgGreen + "Spotify..." + FgWhite + "\n");

            spotify.search({ type: 'track', query: findThis }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(FgGreen + "----------Spotify Search Results!----------\n" + FgWhite);
                console.log(FgGreen + 'Artist(s): ' + FgWhite + data.tracks.items[0].artists[0].name);
                console.log(FgGreen + 'Song: ' + FgWhite + data.tracks.items[0].name);
                console.log(FgGreen + 'Album: ' + FgWhite + data.tracks.items[0].album.name);
                console.log(terminalLink(FgGreen + 'Preview:' + FgWhite, data.tracks.items[0].artists[0].external_urls.spotify));
                console.log(FgGreen + "\n-------------------------------------------" + FgWhite);
                fs.appendFile("log.txt", logIt + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("\nlog.txt was updated!\n");
                });
            });
            break;

        case "movie-this":

            if (findThis === "") {
                findThis = "Mr.+Nobody"}

            var queryUrl = "http://www.omdbapi.com/?t=" + findThis + "&y=&plot=short&apikey=" + keys.omdb.key;
            var logIt = search.concat("," + findThis)

            console.log("Searching " + FgBlue + "OMDB..." + FgWhite + "\n")

            request(queryUrl, function (error, response, body) {

                if (error) {
                    console.log(error);
                } else if (!error && response.statusCode === 200 && JSON.parse(body).Ratings !== undefined) {
                    console.log(FgBlue + "----------Your Movie Search Results----------\n" + FgWhite);
                    console.log(FgBlue + "Year: " + FgWhite + JSON.parse(body).Year);
                    console.log(FgBlue + "Title: " + FgWhite + JSON.parse(body).Title);
                    console.log(FgBlue + "Actors: " + FgWhite + JSON.parse(body).Actors);
                    console.log(FgBlue + "Country: " + FgWhite + JSON.parse(body).Country);
                    console.log(FgBlue + "Language: " + FgWhite + JSON.parse(body).Language);
                    console.log(FgBlue + "IMDB Rating: " + FgWhite + JSON.parse(body).imdbRating);
                    console.log(FgBlue + "Rotten Tomatoes Rating: " + FgWhite + JSON.parse(body).Ratings[1].Value);
                    console.log(FgBlue + "Plot: " + FgWhite + JSON.parse(body).Plot);
                    console.log(FgBlue + "\n---------------------------------------------" + FgWhite);
                    fs.appendFile("log.txt", logIt + "\n", function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("\nlog.txt was updated!\n");
                    });
                } else {
                    console.log("That movie does not exist in the " + FgBlue + "OMDB..." + FgWhite + "\n")
                }

            });
            break;

        case "do-what-it-says":

            fs.readFile("random.txt", "utf8", function (error, data) {
                var dataArr = data.split(",");
                if (error) {
                    return console.log(error);
                }
                search = dataArr[0];
                findThis = dataArr[1];
                liriBot();
            });

            break;

        default:
            console.log("Not a valid input. Please use the following options: " + FgGreen + "\n * spotify-this-song " + FgCyan + "\n * my-tweets " + FgBlue + "\n * movie-this " + FgMagenta + "\n * do-what-it-says" + FgWhite)
            break;
    };
};

liriBot();