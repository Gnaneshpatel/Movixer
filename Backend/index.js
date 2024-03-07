const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

//MongoDB database connection

const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/IIA", {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then((data) => {
    console.log(
      `MongoDb Database Connected to the Server : ${data.connection.host}`
    );
  })
  .catch((err) => {
    console.log(`Some Database Connection Error Occured :- ${err}`);
  });


// creating MovieDetail Schema

const { Schema } = mongoose;

const M1 = new Schema({
  Movie: String
})

const M = mongoose.model('M1', M1);

const MovieList = new Schema({
  Movie: String
})

const Movielist = mongoose.model('Movielist', MovieList);

const MovieDetail = new Schema({
  Movie: String, // String is shorthand for {type: String}
  overview: String,
  date: String,
  ratings: [{
    source: String,
    value: String
  }],
  Imdb_id: String,
  runtime: String,
  Genre: [String],
  Actors: [String],
  Director: String,
  Poster: String,
  Boxoffice_collection: String,
  avg_rating: String
});

const Movie = mongoose.model('Movie', MovieDetail);


// Trending Movies of  the Day

app.get('/Trending_Movies_of_the_day', (req, res) => {
  const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(movies => res.json(movies))
    .catch(err => console.error('error:' + err));
});


//Get all list of genre ------------------------------------------------------------------------------

app.get('/list_of_genre', (req, res) => {
  const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(genre => res.json(genre))
    .catch(err => console.error('error:' + err));
})



// fetch top rated movies -----------------------------------------------------------------------------
app.get('/toprated_movies', (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(top_movies => res.json(top_movies))
    .catch(err => console.error('error:' + err));
})


// Popular Movies --------------------------------------------------------------------------------------
app.get("/popular_movies", (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(pop_movies => res.json(pop_movies))
    .catch(err => console.error('error:' + err));
})


//fetch movie details from APIS
const fetchMovieDetails = async () => {

  try {

    console.log('Attempting to retrieve documents...');
    var documents = await M.find().exec();

    for (let i = 2000; i < 2001; i++) {

      let overview_ = "";
      let Imdb_id_ = "";
      let ratings_ = [];
      let runtime_ = "";
      let genre_ = [];
      let actors_ = [];
      let director_ = "";
      let poster_ = "";
      let Boxoffice_collection_ = "";
      let Movie_ = "";
      let date_ = "";
      let avg_rating_ = "";

      let Movie_name = documents[i].Movie;

      // omdb fetch
      await fetch(`https://www.omdbapi.com/?t=${Movie_name}&apikey=343ba5e6`)
        .then(res => res.json())
        .then(res => {
          if (res) {
            console.log(res);
            Imdb_id = res.imdbID;
            runtime_ = res.Runtime;
            genre_ = res.Genre;
            actors_ = res.Actors;
            director_ = res.Director;
            poster_ = res.Poster;
            Boxoffice_collection_ = res.BoxOffice;
            ratings_ = res.Ratings.map(rating => ({
              source: rating.Source,
              value: rating.Value
            }));
          }
        })
        .catch(err => console.error('error:' + err));



      // fetch perticular movie using TMDB--------------------------------------------------------------------------
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
        }
      };

      await fetch(`https://api.themoviedb.org/3/search/movie?query=${Movie_name}&include_adult=false&language=en-US&page=1`, options)
        .then(res => res.json())
        .then(res => {
          if (res) {

            Movie_ = res.results[0].title;
            date_ = res.results[0].release_date;
            overview_ = res.results[0].overview;
            avg_rating_ = res.results[0].vote_average;

          }
        })
        .catch(err => console.error('error:' + err));

      const MovieData = {
        Movie: Movie_,
        overview: overview_,
        ratings: ratings_,
        Imdb_id: Imdb_id_,
        runtime: runtime_,
        Genre: genre_,
        Actors: actors_,
        Director: director_,
        Poster: poster_,
        date: date_,
        Boxoffice_collection: Boxoffice_collection_,
        avg_rating: avg_rating_
      };
      

      //check is movie already exist in database
      MovieName_ = Movie_name.charAt(0).toUpperCase() + Movie_name.slice(1);


      // Define your search query
      const searchQuery = { Movie: MovieName_ }; // Replace with the title you're searching for

      const movies = await Movie.find(searchQuery);

      if(movies.length != 0){
        try {
          const updatedMovie = await Movie.findOneAndUpdate(
            { Movie: MovieName_ },
            { $set: MovieData },
            { new: true }
          );
      
          if (!updatedMovie) {
            res.status(404).json({ message: 'Movie not found' });
          }
          console.log("movie data updated", updatedMovie);
          
        } catch (error) {
          console.error('Error updating data', error);
        }
      }else{
      const movieInstance = new Movie(MovieData);

      // Save the instance to MongoDB
      movieInstance.save()
        .then(savedMovie => {
          console.log('Movie details saved:', savedMovie);
        })
        .catch(error => {
          console.error('Error saving movie details:', error);
        });
      }
    }
  } catch (error) {
    console.error('Error retrieving documents:', error);
  }
};



//post movie name to get movie details
app.post('/getMovieDetails', async (req, res) => {

  const { movieName } = req.body;

  movieName_ = movieName.charAt(0).toUpperCase() + movieName.slice(1);


  // Define your search query
  const searchQuery = { Movie: movieName_ }; // Replace with the title you're searching for

  // Perform the search
  (async () => {
    try {
      const movies = await Movie.find(searchQuery);
      // console.log('Found movies:', movies);
      if (movies.length != 0) {
        console.log("first")
        res.json(movies);
      } else {
        let overview_ = "";
        let Imdb_id_ = "";
        let ratings_ = [];
        let runtime_ = "";
        let genre_ = [];
        let actors_ = [];
        let director_ = "";
        let poster_ = "";
        let Boxoffice_collection_ = "";
        let Movie_ = "";
        let date_ = "";
        let avg_rating_ = "";

        let flag = false;
        // omdb 
        await fetch(`https://www.omdbapi.com/?t=${movieName_}&apikey=343ba5e6`)
          .then(res => res.json())
          .then(res => {
            if (res) {
              // console.log("omdb response",res);
              Imdb_id = res.imdbID;
              runtime_ = res.Runtime;
              genre_ = res.Genre;
              actors_ = res.Actors;
              director_ = res.Director;
              poster_ = res.Poster;
              Boxoffice_collection_ = res.BoxOffice;
              ratings_ = res.Ratings.map(rating => ({
                source: rating.Source,
                value: rating.Value
              }));
            }else{
              flag= true;
            }
          })
          .catch(err => console.error('error:' + err));
        
        //response not found in omdb so fetching response from tmdb
        if(flag){
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
            }
          };
  
          await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName_}&include_adult=false&language=en-US&page=1`, options)
            .then(res => res.json())
            .then(res => {
              if (res) {
                //give whole response from tmdb 
                console.log(res.results.length);
                let ans=0;
                for(let i=0;i<res.results.length;i++){
                  if(movieName_ === res.results[i].title){
                    ans=i;
                    break;
                  }
                }
                Movie_ = res.results[ans].title;
                date_ = res.results[ans].release_date;
                overview_ = res.results[ans].overview;
                avg_rating_ = res.results[ans].vote_average;
                Imdb_id = res.results[ans].id;
                runtime_ = " ";
                genre_ = " ";
                actors_ = " ";
                director_ = res.results[ans];
                poster_ = res.results[ans].poster_path;
                Boxoffice_collection_ = res.results[ans];
                ratings_ = res.results[ans].vote_average;

              }
            })
            .catch(err => console.error('error:' + err));
        }


        let flag2= false;
      
        // fetch perticular movie using TMDB--------------------------------------------------------------------------
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTRiNzMxMjk2ZWUyNjkyZTIxMmE4MmY5MDg0NzJjZSIsInN1YiI6IjY1MDFjM2RjZTBjYTdmMDEyZWI5NDVlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tONQhTueUjsKVJNOO84mUD80Z1aeOcAjmnuTJRB4PCY'
          }
        };

        await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName_}&include_adult=false&language=en-US&page=1`, options)
          .then(res => res.json())
          .then(res => {
            if (res) {
              // console.log("tmdb response",res);
              console.log(res.results.length);
              let ans=0;
              for(let i=0;i<res.results.length;i++){
                if(movieName_ === res.results[i].title){
                  ans=i;
                  break;
                }
              }
              Movie_ = res.results[ans].title;
              date_ = res.results[ans].release_date;
              overview_ = res.results[ans].overview;
              avg_rating_ = res.results[ans].vote_average;
            }else{
              flag2=true;
            }
          })
          .catch(err => console.error('error:' + err));
        
        //response not found in tmdb so fetching whole response from omdb
        if(flag2){
          await fetch(`https://www.omdbapi.com/?t=${movieName_}&apikey=343ba5e6`)
          .then(res => res.json())
          .then(res => {
            if (res) {
              //whole response from omdb
              Movie_ = res.Title;
              date_ = res.Year;
              overview_ = res.Plot;
              avg_rating_ = res.imdbRating;
              Imdb_id = res.imdbID;
              runtime_ = res.Runtime;
              genre_ = res.Genre;
              actors_ = res.Actors;
              director_ = res.Director;
              poster_ = res.Poster;
              Boxoffice_collection_ = res.BoxOffice;
              ratings_ = res.Ratings.map(rating => ({
                source: rating.Source,
                value: rating.Value
              }));
            }
          })
          .catch(err => console.error('error:' + err));
        }
        
        const MovieData = {
          Movie: Movie_,
          overview: overview_,
          ratings: ratings_,
          Imdb_id: Imdb_id_,
          runtime: runtime_,
          Genre: genre_,
          Actors: actors_,
          Director: director_,
          Poster: poster_,
          date: date_,
          Boxoffice_collection: Boxoffice_collection_,
          avg_rating: avg_rating_
        };
        // console.log(MovieData);

        const movieInstance = new Movie(MovieData);

        // Save the instance to MongoDB
        if (MovieData.Movie != "") {
          movieInstance.save()
            .then(savedMovie => {
              console.log('Movie details saved:', savedMovie);
            })
            .catch(error => {
              console.error('Error saving movie details:', error);
            });
          console.log("first2")
          res.json(MovieData);
        } else {
          res.json("Movie Not Found")
        }
      }
    } catch (err) {
      console.error(err);
    }
  })();

  // res.json(MovieData);
});

// to feetch all the movies from list and store there information in database
app.get('/storeMovieDetails', () => {
  fetchMovieDetails();
})

// fetch movie list by genre
app.get('/movies/byGenre/:genre', async (req, res) => {
  const genreToFind = req.params.genre; // Convert to lowercase for case-insensitive comparison
  try {
    const movies = await Movie.find({});
    const fetchMovieDetails = [];
    for (let i = 0; i < movies.length; i++) {
      // console.log(movies[i])

      let genres = movies[i].Genre;
      if (Array.isArray(genres) && genres.length > 0) {
        genres = genres[0]; // Assuming genres is an array with a single string element
        // console.log(genres);
      }
      if (typeof genres === 'string' && genres.trim() !== '') {
        const genresArray = genres.split(',');
        // console.log(genresArray);
        for (let j = 0; j < genresArray.length; j++) {
          // console.log(genreToFind,"genretofind")
          const trimmedStr = genresArray[j].trimStart();
          const trimmed = trimmedStr.trimEnd();
          // console.log(trimmed === genreToFind)
          if (trimmed === genreToFind) {
            fetchMovieDetails.push(movies[i]);
            break; 
          }
        }
      }
    }
    // console.log(fetchMovieDetails)
    return res.status(200).send(fetchMovieDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})